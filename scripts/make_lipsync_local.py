"""Debug + improved lip sync: warp using exact inner-lip landmarks."""
from pathlib import Path
import math
import subprocess
import shutil
import wave

import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision

ROOT = Path(__file__).resolve().parents[1]
IMG = ROOT / "public" / "media" / "hero-portrait.jpg"
AUDIO_MP3 = ROOT / "public" / "media" / "intro-voice.mp3"
AUDIO_WAV = ROOT / "public" / "media" / "intro-voice.wav"
OUT_TMP = ROOT / "public" / "media" / "hero-intro-nosound.mp4"
OUT = ROOT / "public" / "media" / "hero-intro.mp4"
BACKUP = ROOT / "public" / "media" / "hero-intro-zoom-only.mp4"
MODEL = ROOT / "scripts" / "face_landmarker.task"
DEBUG = ROOT / "_lipcheck"
FFMPEG = r"C:\Users\rawan\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"

# MediaPipe face mesh lip indices
LIPS = [
    61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 185, 40, 39, 37, 0,
    267, 269, 270, 409, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
    191, 80, 81, 82, 13, 312, 311, 310, 415,
]


def ensure_wav():
    if not AUDIO_WAV.exists():
        subprocess.check_call(
            [FFMPEG, "-y", "-i", str(AUDIO_MP3), "-ac", "1", "-ar", "16000", str(AUDIO_WAV)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )


def load_envelope(fps=30):
    with wave.open(str(AUDIO_WAV), "rb") as w:
        sr = w.getframerate()
        samples = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
    frame_len = max(1, int(sr / fps))
    env = []
    for i in range(0, len(samples), frame_len):
        chunk = samples[i : i + frame_len]
        if len(chunk) == 0:
            break
        env.append(float(np.sqrt(np.mean(chunk * chunk)) + 1e-8))
    env = np.array(env, dtype=np.float32)
    kernel = np.array([0.1, 0.2, 0.4, 0.2, 0.1], dtype=np.float32)
    env = np.convolve(env, kernel, mode="same")
    env = np.clip(env / (np.percentile(env, 88) + 1e-6), 0, 1)
    env = np.power(env, 0.65)
    return env


def get_landmarks(img_bgr):
    h, w = img_bgr.shape[:2]
    rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    options = vision.FaceLandmarkerOptions(
        base_options=mp_python.BaseOptions(model_asset_path=str(MODEL)),
        running_mode=vision.RunningMode.IMAGE,
        num_faces=1,
    )
    landmarker = vision.FaceLandmarker.create_from_options(options)
    result = landmarker.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb))
    if not result.face_landmarks:
        raise SystemExit("No face found")
    face = result.face_landmarks[0]
    return np.array([[lm.x * w, lm.y * h] for lm in face], dtype=np.float32)


def animate_mouth(img, pts, amount):
    """Natural-looking mouth open via lip separation warp (no black overlay)."""
    out = img.copy()
    if amount < 0.05:
        return out

    h, w = img.shape[:2]
    upper = pts[13]
    lower = pts[14]
    left = pts[61]
    right = pts[291]

    cx = float((left[0] + right[0]) * 0.5)
    cy = float((upper[1] + lower[1]) * 0.5)
    mw = float(np.linalg.norm(right - left))

    # Wider ROI so jaw drop looks natural
    rw = int(mw * 2.1)
    rh = int(mw * 1.8)
    x0 = int(np.clip(cx - rw / 2, 0, w - 2))
    y0 = int(np.clip(cy - rh * 0.45, 0, h - 2))
    x1 = int(np.clip(x0 + rw, 1, w - 1))
    y1 = int(np.clip(y0 + rh, 1, h - 1))
    if x1 - x0 < 16 or y1 - y0 < 16:
        return out

    roi = out[y0:y1, x0:x1].copy()
    rh, rw = roi.shape[:2]
    local_cy = float(cy - y0)
    open_px = 4.0 + 18.0 * amount

    # Build smooth vertical displacement field concentrated near mouth width
    xs = np.arange(rw, dtype=np.float32)
    ys = np.arange(rh, dtype=np.float32)
    map_x = np.tile(xs, (rh, 1))
    map_y = np.tile(ys[:, None], (1, rw))

    # Horizontal falloff: stronger in center of mouth, weaker at corners
    hx = np.exp(-0.5 * ((xs - (cx - x0)) / (mw * 0.42)) ** 2)
    for y in range(rh):
        dy = y - local_cy
        if dy < 0:
            # upper lip / philtrum lifts a little
            strength = open_px * 0.45 * hx
            map_y[y, :] = y + strength * ((local_cy - y) / max(1.0, local_cy))
        else:
            # lower lip / chin drops
            strength = open_px * hx
            map_y[y, :] = y - strength * (dy / max(1.0, rh - local_cy)) ** 0.85

    map_y = np.clip(map_y, 0, rh - 1)
    warped = cv2.remap(roi, map_x, map_y.astype(np.float32), interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

    # Subtle inner-mouth shading using local lip colors (not flat black)
    shade = warped.copy().astype(np.float32)
    # sample lip color near center
    lx = int(np.clip(cx - x0, 2, rw - 3))
    ly = int(np.clip(local_cy, 2, rh - 3))
    lip_color = warped[ly - 2 : ly + 3, lx - 4 : lx + 5].reshape(-1, 3).mean(axis=0)
    dark = lip_color * np.array([0.35, 0.30, 0.30], dtype=np.float32)
    axes = (
        max(4, int(mw * 0.22 * (0.5 + 0.5 * amount))),
        max(2, int(1.5 + open_px * 0.28)),
    )
    overlay = np.zeros_like(shade)
    cv2.ellipse(
        overlay,
        (lx, int(local_cy + open_px * 0.08)),
        axes,
        0,
        0,
        360,
        dark.tolist(),
        -1,
    )
    overlay = cv2.GaussianBlur(overlay, (0, 0), sigmaX=1.8, sigmaY=1.2)
    # Only where overlay is non-zero
    mask_c = (overlay.max(axis=2) > 1).astype(np.float32)
    mask_c = cv2.GaussianBlur(mask_c, (0, 0), 1.5)[..., None]
    cavity = shade * (1 - 0.55 * amount * mask_c) + overlay * (0.55 * amount * mask_c)
    warped = np.clip(cavity, 0, 255).astype(np.uint8)

    # Feather into face
    mask = np.zeros((rh, rw), dtype=np.float32)
    cv2.ellipse(mask, (rw // 2, int(local_cy + 2)), (int(rw * 0.40), int(rh * 0.38)), 0, 0, 360, 1.0, -1)
    mask = cv2.GaussianBlur(mask, (0, 0), sigmaX=rw * 0.08, sigmaY=rh * 0.08)
    mask3 = mask[..., None]
    final_roi = (warped * mask3 + roi * (1 - mask3)).astype(np.uint8)
    out[y0:y1, x0:x1] = final_roi
    return out


def main():
    ensure_wav()
    DEBUG.mkdir(exist_ok=True)
    env = load_envelope()
    img = cv2.imread(str(IMG))
    img = cv2.resize(img, (900, 1200), interpolation=cv2.INTER_AREA)
    pts = get_landmarks(img)

    # Debug stills
    cv2.imwrite(str(DEBUG / "dbg_rest.jpg"), animate_mouth(img, pts, 0.0))
    cv2.imwrite(str(DEBUG / "dbg_mid.jpg"), animate_mouth(img, pts, 0.45))
    cv2.imwrite(str(DEBUG / "dbg_open.jpg"), animate_mouth(img, pts, 1.0))
    # Draw landmark dots for mouth QA
    qa = img.copy()
    for i in LIPS:
        x, y = pts[i].astype(int)
        cv2.circle(qa, (x, y), 2, (0, 255, 0), -1)
    cv2.imwrite(str(DEBUG / "dbg_landmarks.jpg"), qa)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(OUT_TMP), fourcc, 30.0, (900, 1200))
    print(f"Rendering {len(env)} frames...")
    for i, amount in enumerate(env):
        idle = 0.02 * math.sin(i / 7.0)
        frame = animate_mouth(img, pts, float(np.clip(amount + idle, 0, 1)))
        writer.write(frame)
    writer.release()

    if OUT.exists() and not BACKUP.exists():
        shutil.copy2(OUT, BACKUP)

    subprocess.check_call(
        [
            FFMPEG, "-y",
            "-i", str(OUT_TMP),
            "-i", str(AUDIO_MP3),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k",
            "-shortest", "-movflags", "+faststart",
            str(OUT),
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    OUT_TMP.unlink(missing_ok=True)
    print("Wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
