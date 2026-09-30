import time
import shutil
from pathlib import Path
import httpx
from gradio_client import Client, handle_file

ROOT = Path(__file__).resolve().parents[1]
image = str(ROOT / "public" / "media" / "hero-portrait.jpg")
audio = str(ROOT / "public" / "media" / "intro-voice.mp3")
out_path = ROOT / "public" / "media" / "hero-intro.mp4"
backup = ROOT / "public" / "media" / "hero-intro-zoom-only.mp4"
SPACE = "https://manavisrani07-gradio-lipsync-wav2lip.hf.space"
REMOTE = "/home/user/app/results/output.mp4"

client = Client("manavisrani07/gradio-lipsync-wav2lip")
print("Submitting Wav2Lip job...")
job = client.submit(
    handle_file(image),
    handle_file(audio),
    "Wav2Lip",
    0,
    15,
    0,
    0,
    1,
    api_name="/generate",
)

while not job.done():
    print("status:", job.status().code)
    time.sleep(4)

print("Job finished; attempting direct file downloads...")

urls = [
    f"{SPACE}/gradio_api/file={REMOTE}",
    f"{SPACE}/file={REMOTE}",
    f"{SPACE}/gradio_api/file={REMOTE}?download=1",
    f"{SPACE}/call/file={REMOTE}",
]

# Also try extracting URL from exception / job internals
try:
    job.result()
except Exception as e:
    msg = str(e)
    print("result error:", msg[:300])
    if "http" in msg:
        for part in msg.replace("'", " ").replace('"', " ").split():
            if part.startswith("http") and ("file" in part or ".mp4" in part):
                urls.insert(0, part)

if out_path.exists() and not backup.exists():
    shutil.copy2(out_path, backup)

with httpx.Client(timeout=120.0, follow_redirects=True, headers={"User-Agent": "Mozilla/5.0"}) as http:
    for u in urls:
        try:
            print("GET", u)
            r = http.get(u)
            ctype = r.headers.get("content-type", "")
            print(" ->", r.status_code, ctype, len(r.content))
            if r.status_code == 200 and len(r.content) > 20000 and (
                "video" in ctype or "octet" in ctype or u.endswith(".mp4") or r.content[4:8] == b"ftyp"
            ):
                out_path.write_bytes(r.content)
                print("SUCCESS Wrote", out_path, out_path.stat().st_size)
                break
        except Exception as ex:
            print("fail", ex)
    else:
        # Last resort: local audio-driven mouth animation with MediaPipe + OpenCV
        print("Remote download failed. Falling back to local lip animation...")
        raise SystemExit(2)
