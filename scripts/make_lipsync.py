from gradio_client import Client, handle_file
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
image = str(ROOT / "public" / "media" / "hero-portrait.jpg")
audio = str(ROOT / "public" / "media" / "intro-voice.mp3")
out_dir = ROOT / "public" / "media"
out_path = out_dir / "hero-intro.mp4"

print("Connecting to Wav2Lip space...")
client = Client("manavisrani07/gradio-lipsync-wav2lip")

print("Generating lip-synced video (may take several minutes)...")
# Labels/names are mismatched in this Space API; pass positional args carefully.
# Order: video, audio, checkpoint, pad_top?, pad_bottom?, pad_left?, pad_right?, resize?
result = client.predict(
    handle_file(image),
    handle_file(audio),
    "Wav2Lip",  # checkpoint
    0,   # pad top (param name no_smooth)
    15,  # pad bottom - include chin (param name resize_factor)
    0,   # pad left (param name pad_top)
    0,   # pad right (param name pad_bottom)
    1,   # resize factor (param name pad_left)
    api_name="/generate",
)

print("RAW RESULT:", result)

candidate = result
if isinstance(result, (list, tuple)):
    candidate = next(
        (
            x
            for x in result
            if isinstance(x, str) and str(x).lower().endswith((".mp4", ".avi", ".webm", ".gif"))
        ),
        result[0],
    )

src = Path(str(candidate))
print("CANDIDATE:", src)
if not src.exists():
    raise SystemExit(f"Output file missing: {src}")

backup = out_dir / "hero-intro-zoom-only.mp4"
if out_path.exists() and not backup.exists():
    shutil.copy2(out_path, backup)

shutil.copy2(src, out_path)
print("Wrote", out_path, "size", out_path.stat().st_size)
