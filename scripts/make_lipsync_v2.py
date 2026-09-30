import json
import time
import shutil
from pathlib import Path
import httpx
from gradio_client import Client, handle_file

ROOT = Path(__file__).resolve().parents[1]
image = ROOT / "public" / "media" / "hero-portrait.jpg"
audio = ROOT / "public" / "media" / "intro-voice.mp3"
out_path = ROOT / "public" / "media" / "hero-intro.mp4"
backup = ROOT / "public" / "media" / "hero-intro-zoom-only.mp4"

SPACE = "https://manavisrani07-gradio-lipsync-wav2lip.hf.space"

client = Client("manavisrani07/gradio-lipsync-wav2lip")
print("Submitting job...")
job = client.submit(
    handle_file(str(image)),
    handle_file(str(audio)),
    "Wav2Lip",
    0,
    15,
    0,
    0,
    1,
    api_name="/generate",
)

while not job.done():
    st = job.status()
    print("status:", getattr(st, "code", st))
    time.sleep(5)

print("done. trying outputs...")
try:
    result = job.result()
    print("result ok", result)
except Exception as e:
    print("result failed:", type(e).__name__, e)
    # Fall back: inspect communicator messages if available
    raw = None
    for attr in ("outputs", "_outputs", "output"):
        if hasattr(job, attr):
            print(attr, getattr(job, attr))
    # Try reading future exception args / internal state
    if hasattr(job, "status"):
        print("final status", job.status())

# Alternative: call Gradio queue API ourselves
print("Trying direct Gradio queue API...")
with httpx.Client(timeout=300.0, follow_redirects=True) as http:
    # upload files
    def upload(path: Path):
        files = {"files": (path.name, path.read_bytes(), "application/octet-stream")}
        r = http.post(f"{SPACE}/gradio_api/upload", files=files)
        r.raise_for_status()
        data = r.json()
        print("upload", path.name, data)
        return data[0] if isinstance(data, list) else data

    img_path = upload(image)
    aud_path = upload(audio)

    payload = {
        "data": [
            {"path": img_path, "meta": {"_type": "gradio.FileData"}},
            {"path": aud_path, "meta": {"_type": "gradio.FileData"}},
            "Wav2Lip",
            0,
            15,
            0,
            0,
            1,
        ]
    }
    r = http.post(f"{SPACE}/gradio_api/call/generate", json=payload)
    print("call status", r.status_code, r.text[:500])
    r.raise_for_status()
    event_id = r.json()["event_id"]
    print("event_id", event_id)

    # stream result
    with http.stream("GET", f"{SPACE}/gradio_api/call/generate/{event_id}") as resp:
        resp.raise_for_status()
        buf = ""
        for chunk in resp.iter_text():
            buf += chunk
            print(chunk[:300])
            if "error" in chunk.lower() and "data:" in chunk:
                pass

    # parse last data line
    lines = [ln for ln in buf.splitlines() if ln.startswith("data:")]
    if not lines:
        raise SystemExit("No data lines from event stream")
    last = json.loads(lines[-1][5:].strip())
    print("LAST DATA:", json.dumps(last)[:1000])

    # Find file url/path in nested structure
    def find_files(obj, found=None):
        if found is None:
            found = []
        if isinstance(obj, dict):
            if "url" in obj and isinstance(obj["url"], str):
                found.append(obj["url"])
            if "path" in obj and isinstance(obj["path"], str) and obj["path"].endswith(".mp4"):
                found.append(obj["path"])
            for v in obj.values():
                find_files(v, found)
        elif isinstance(obj, list):
            for v in obj:
                find_files(v, found)
        return found

    files = find_files(last)
    print("files found", files)
    if not files:
        raise SystemExit("No output file references")

    url = files[0]
    if url.startswith("/"):
        url = SPACE + url
    if url.startswith("http") is False and "file=" in str(files[0]):
        url = f"{SPACE}/gradio_api/file={files[0]}"

    # Try common URL forms
    candidates = [url]
    for f in files:
        if isinstance(f, str):
            if f.startswith("http"):
                candidates.append(f)
            else:
                candidates.append(f"{SPACE}/gradio_api/file={f}")
                candidates.append(f"{SPACE}/file={f}")

    saved = False
    for u in candidates:
        try:
            print("download try", u)
            resp = http.get(u)
            print(" ->", resp.status_code, resp.headers.get("content-type"), len(resp.content))
            if resp.status_code == 200 and len(resp.content) > 10000:
                if out_path.exists() and not backup.exists():
                    shutil.copy2(out_path, backup)
                out_path.write_bytes(resp.content)
                print("Wrote", out_path, out_path.stat().st_size)
                saved = True
                break
        except Exception as ex:
            print("download err", ex)

    if not saved:
        raise SystemExit("Could not download lip-sync video")
