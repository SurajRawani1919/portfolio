"""Real Wav2Lip inference on a single portrait + voice -> talking mp4 (CPU)."""
import sys, os, math, subprocess, shutil
import numpy as np, cv2, torch
sys.path.insert(0, os.path.dirname(__file__))
import audio
from models import Wav2Lip
import mediapipe as mp
from mediapipe.tasks import python as mpp
from mediapipe.tasks.python import vision

MEDIA = r"C:\Users\rawan\OneDrive\Desktop\Portfolio\web\public\media"
IMG = MEDIA + r"\hero-portrait.jpg"
WAV = MEDIA + r"\intro-voice.wav"
MP3 = MEDIA + r"\intro-voice.mp3"
LMK = r"C:\Users\rawan\OneDrive\Desktop\Portfolio\web\scripts\face_landmarker.task"
CKPT = r"C:\wav2lip_work\checkpoints\wav2lip_gan.pth"
FFMPEG = r"C:\Users\rawan\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe"
OUT = r"C:\wav2lip_work\wav2lip_out.mp4"
FPS, W, H = 30, 900, 1200

img = cv2.resize(cv2.imread(IMG), (W, H), interpolation=cv2.INTER_AREA)
lm = vision.FaceLandmarker.create_from_options(vision.FaceLandmarkerOptions(
    base_options=mpp.BaseOptions(model_asset_path=LMK), num_faces=1))
res = lm.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(img, cv2.COLOR_BGR2RGB)))
pts = np.array([[p.x * W, p.y * H] for p in res.face_landmarks[0]])
x1, y1 = pts.min(0); x2, y2 = pts.max(0)
# Wav2Lip-style square-ish face box: brow-to-chin(+pad)
y1 = pts[[10]].min() + (pts[152][1] - pts[10][1]) * 0.15
y2 = pts[152][1] + 12
x1, x2 = int(x1), int(x2); y1, y2 = int(y1), int(y2)
print("face box", x1, y1, x2, y2)

wav = audio.load_wav(WAV, 16000)
mel = audio.melspectrogram(wav)
mel_step, idx_mult = 16, 80.0 / FPS
chunks, i = [], 0
while True:
    s = int(i * idx_mult)
    if s + mel_step > mel.shape[1]:
        chunks.append(mel[:, -mel_step:]); break
    chunks.append(mel[:, s:s + mel_step]); i += 1
print("frames", len(chunks))

dev = "cpu"
model = Wav2Lip()
ck = torch.load(CKPT, map_location="cpu", weights_only=False)
model.load_state_dict({k.replace("module.", ""): v for k, v in ck["state_dict"].items()})
model = model.to(dev).eval()

face = cv2.resize(img[y1:y2, x1:x2], (96, 96))
masked = face.copy(); masked[48:] = 0
ff = subprocess.Popen([FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
    "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", MP3, "-c:v", "libx264", "-pix_fmt", "yuv420p",
    "-crf", "18", "-c:a", "aac", "-b:a", "128k", "-shortest", OUT], stdin=subprocess.PIPE)

bw, bh = x2 - x1, y2 - y1
mask = np.zeros((bh, bw), np.float32)
mask[int(bh * 0.42):, :] = 1           # lower face only; keeps eyes/brows sharp
mask = cv2.GaussianBlur(mask, (0, 0), bw * 0.035)
mask[: int(bh * 0.3)] = 0
mask = mask[..., None]

B = 16
with torch.no_grad():
    for b in range(0, len(chunks), B):
        mb = np.stack(chunks[b:b + B])[..., None]
        n = len(mb)
        ib = np.concatenate([masked, face], axis=2)[None].repeat(n, 0) / 255.0
        ib = torch.FloatTensor(ib.transpose(0, 3, 1, 2))
        mt = torch.FloatTensor(mb.transpose(0, 3, 1, 2))
        pred = model(mt, ib).cpu().numpy().transpose(0, 2, 3, 1) * 255.0
        for j in range(n):
            p = cv2.resize(pred[j].astype(np.uint8), (bw, bh), interpolation=cv2.INTER_CUBIC)
            f = img.copy()
            reg = f[y1:y2, x1:x2].astype(np.float32)
            f[y1:y2, x1:x2] = (p * mask + reg * (1 - mask)).astype(np.uint8)
            ff.stdin.write(f.tobytes())
        print("batch", b // B + 1, "/", math.ceil(len(chunks) / B), flush=True)
ff.stdin.close(); ff.wait()
print("done", OUT, os.path.getsize(OUT))
