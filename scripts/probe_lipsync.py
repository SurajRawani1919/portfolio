from gradio_client import Client

spaces = [
    "fffiloni/SadTalker",
    "vinthony/SadTalker",
    "manavisrani07/gradio-lipsync-wav2lip",
    "BraveColony/lipsync",
]

for s in spaces:
    try:
        c = Client(s)
        info = c.view_api(print_info=False, return_format="dict")
        named = info.get("named_endpoints") or {}
        print("OK", s)
        print("endpoints", list(named.keys())[:10])
    except Exception as e:
        print("FAIL", s, type(e).__name__, str(e)[:200])
