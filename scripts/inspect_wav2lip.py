from gradio_client import Client
import json

c = Client("manavisrani07/gradio-lipsync-wav2lip")
info = c.view_api(print_info=False, return_format="dict")
print(json.dumps(info.get("named_endpoints", {}), indent=2)[:4000])
