"""
Flask API backend for the CycleGAN image transformation web UI.
Loads the horse2zebra pretrained model and exposes a /transform endpoint.
"""

import os
import io
import base64
import torch
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from torchvision import transforms

# ── path setup ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Flask app ────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder=os.path.join(BASE_DIR, "frontend"))
CORS(app)

# ── device ───────────────────────────────────────────────────────────────────
DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Running on device: {DEVICE}")

# ── lazy-load model cache ─────────────────────────────────────────────────────
_model_cache = {}


def load_model(name: str):
    """Load a CycleGAN generator model by checkpoint name (cached)."""
    if name in _model_cache:
        return _model_cache[name]

    from models.networks import ResnetGenerator, get_norm_layer
    import functools

    checkpoint_path = os.path.join(
        BASE_DIR, "checkpoints", f"{name}_pretrained", "latest_net_G.pth"
    )
    if not os.path.exists(checkpoint_path):
        raise FileNotFoundError(f"Checkpoint not found: {checkpoint_path}")

    norm_layer = get_norm_layer(norm_type="instance")
    net = ResnetGenerator(
        input_nc=3, output_nc=3, ngf=64,
        norm_layer=norm_layer, use_dropout=False, n_blocks=9
    )
    state_dict = torch.load(checkpoint_path, map_location=str(DEVICE), weights_only=True)

    # patch old InstanceNorm checkpoints
    for key in list(state_dict.keys()):
        _patch_instance_norm(state_dict, net, key.split("."))

    net.load_state_dict(state_dict)
    net.to(DEVICE)
    net.eval()

    _model_cache[name] = net
    print(f"[INFO] Model '{name}' loaded from {checkpoint_path}")
    return net


def _patch_instance_norm(state_dict, module, keys, i=0):
    key = keys[i]
    if i + 1 == len(keys):
        if module.__class__.__name__.startswith("InstanceNorm") and key in ("running_mean", "running_var"):
            if getattr(module, key) is None:
                state_dict.pop(".".join(keys), None)
        if module.__class__.__name__.startswith("InstanceNorm") and key == "num_batches_tracked":
            state_dict.pop(".".join(keys), None)
    else:
        if hasattr(module, key):
            _patch_instance_norm(state_dict, getattr(module, key), keys, i + 1)


# ── image pre/post processing ─────────────────────────────────────────────────
TRANSFORM = transforms.Compose([
    transforms.Resize(256, interpolation=transforms.InterpolationMode.BICUBIC),
    transforms.CenterCrop(256),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
])


def tensor_to_pil(tensor: torch.Tensor) -> Image.Image:
    img = tensor.squeeze(0).cpu().float().numpy()
    img = (np.transpose(img, (1, 2, 0)) + 1) / 2.0 * 255.0
    return Image.fromarray(img.astype(np.uint8))


def pil_to_base64(img: Image.Image, fmt: str = "PNG") -> str:
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return base64.b64encode(buf.getvalue()).decode("utf-8")


# ── routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "device": str(DEVICE),
        "cuda_available": torch.cuda.is_available(),
        "models_loaded": list(_model_cache.keys()),
    })


@app.route("/models")
def available_models():
    """Return list of available pretrained models (checkpoint folders present)."""
    checkpoints_dir = os.path.join(BASE_DIR, "checkpoints")
    models = []
    if os.path.isdir(checkpoints_dir):
        for folder in os.listdir(checkpoints_dir):
            if folder.endswith("_pretrained"):
                pth = os.path.join(checkpoints_dir, folder, "latest_net_G.pth")
                if os.path.exists(pth):
                    name = folder.replace("_pretrained", "")
                    size_mb = round(os.path.getsize(pth) / (1024 * 1024), 1)
                    models.append({"name": name, "size_mb": size_mb})
    return jsonify({"models": models})


@app.route("/transform", methods=["POST"])
def transform():
    """
    POST /transform
    Form data:
        image  - uploaded image file
        model  - model name (default: horse2zebra)
    Returns JSON: { output_image: "<base64 PNG>", model: "...", device: "..." }
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    model_name = request.form.get("model", "horse2zebra")

    try:
        file = request.files["image"]
        img = Image.open(file.stream).convert("RGB")

        # Save original as base64 for side-by-side display
        original_resized = img.resize((256, 256), Image.BICUBIC)
        original_b64 = pil_to_base64(original_resized)

        # Run model
        net = load_model(model_name)
        tensor = TRANSFORM(img).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            output_tensor = net(tensor)
        output_img = tensor_to_pil(output_tensor)
        output_b64 = pil_to_base64(output_img)

        return jsonify({
            "original_image": original_b64,
            "output_image": output_b64,
            "model": model_name,
            "device": str(DEVICE),
        })

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        import traceback
        return jsonify({"error": str(e), "trace": traceback.format_exc()}), 500


# ── main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("[INFO] Preloading horse2zebra model...")
    try:
        load_model("horse2zebra")
    except Exception as e:
        print(f"[WARN] Could not preload model: {e}")
    print("[INFO] Starting server at http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
