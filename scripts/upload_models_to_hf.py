#!/usr/bin/env python3
"""
scripts/upload_models_to_hf.py
================================
One-time utility: uploads all locally trained / downloaded .pth checkpoints
to a Hugging Face model repository so the HF Spaces backend can fetch them
dynamically at runtime.

Usage
-----
  # 1. Install huggingface_hub if not already present
  pip install huggingface_hub

  # 2. Log in (creates ~/.huggingface/token)
  huggingface-cli login

  # 3. Run (dry-run first to preview what will be uploaded)
  python scripts/upload_models_to_hf.py --dry-run

  # 4. Actually upload
  python scripts/upload_models_to_hf.py

  # 5. Upload a single model only
  python scripts/upload_models_to_hf.py --model horse2zebra

Environment variables
---------------------
  HF_REPO   – target model repo id  (default: girimayur/styleshift-models)
  HF_TOKEN  – HF access token       (default: read from ~/.huggingface/token)
"""

from __future__ import annotations

import argparse
import os
import sys

# ── locate project root (one level up from this script) ──────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
CHECKPOINTS  = os.path.join(PROJECT_ROOT, "checkpoints")

# ── model → local subdir + remote path mapping ────────────────────────────────
# Each entry: local_subfolder, local_file, remote_path_in_repo
UPLOAD_MANIFEST = [
    ("horse2zebra_pretrained",            "latest_net_G.pth", "horse2zebra_pretrained/latest_net_G.pth"),
    ("zebra2horse_pretrained",            "latest_net_G.pth", "zebra2horse_pretrained/latest_net_G.pth"),
    ("apple2orange_pretrained",           "latest_net_G.pth", "apple2orange_pretrained/latest_net_G.pth"),
    ("orange2apple_pretrained",           "latest_net_G.pth", "orange2apple_pretrained/latest_net_G.pth"),
    ("summer2winter_yosemite_pretrained", "latest_net_G.pth", "summer2winter_yosemite_pretrained/latest_net_G.pth"),
    ("winter2summer_yosemite_pretrained", "latest_net_G.pth", "winter2summer_yosemite_pretrained/latest_net_G.pth"),
    ("map2sat_pretrained",                "latest_net_G.pth", "map2sat_pretrained/latest_net_G.pth"),
    ("sat2map_pretrained",                "latest_net_G.pth", "sat2map_pretrained/latest_net_G.pth"),
    ("cityscapes_label2photo_pretrained", "latest_net_G.pth", "cityscapes_label2photo_pretrained/latest_net_G.pth"),
    ("facades_label2photo_pretrained",    "latest_net_G.pth", "facades_label2photo_pretrained/latest_net_G.pth"),
]


def upload_all(repo_id: str, token: str | None, dry_run: bool, only_model: str | None):
    try:
        from huggingface_hub import HfApi
    except ImportError:
        print("ERROR: huggingface_hub not installed. Run: pip install huggingface_hub")
        sys.exit(1)

    api = HfApi(token=token)

    # Ensure the target repo exists (create if not)
    if not dry_run:
        try:
            api.create_repo(repo_id=repo_id, repo_type="model", exist_ok=True, private=False)
            print(f"✓ Repo ready: https://huggingface.co/{repo_id}")
        except Exception as e:
            print(f"✗ Could not create/access repo '{repo_id}': {e}")
            sys.exit(1)

    uploaded = 0
    skipped  = 0
    missing  = 0

    for subfolder, filename, remote_path in UPLOAD_MANIFEST:
        # Filter by --model if specified
        model_key = subfolder.replace("_pretrained", "")
        if only_model and model_key != only_model:
            continue

        local_path = os.path.join(CHECKPOINTS, subfolder, filename)

        if not os.path.isfile(local_path):
            print(f"  [SKIP – not found]  {local_path}")
            missing += 1
            continue

        size_mb = os.path.getsize(local_path) / (1024 * 1024)

        if dry_run:
            print(f"  [DRY RUN]  {local_path}  →  {repo_id}/{remote_path}  ({size_mb:.1f} MB)")
            continue

        print(f"  Uploading  {model_key}  ({size_mb:.1f} MB) …", end="  ", flush=True)
        try:
            url = api.upload_file(
                path_or_fileobj=local_path,
                path_in_repo=remote_path,
                repo_id=repo_id,
                repo_type="model",
            )
            print(f"✓  {url}")
            uploaded += 1
        except Exception as e:
            print(f"✗  {e}")
            skipped += 1

    print()
    if dry_run:
        print("Dry run complete. Use --no-dry-run to upload.")
    else:
        print(f"Done.  uploaded={uploaded}  failed={skipped}  missing_locally={missing}")


def main():
    parser = argparse.ArgumentParser(description="Upload CycleGAN checkpoints to HF Hub")
    parser.add_argument(
        "--repo",
        default=os.getenv("HF_REPO", "girimayur/styleshift-models"),
        help="Target HF model repo id (default: girimayur/styleshift-models)",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("HF_TOKEN"),
        help="HF access token (default: read from ~/.huggingface/token)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=True,
        help="Preview what would be uploaded without actually uploading (default: True)",
    )
    parser.add_argument(
        "--no-dry-run",
        dest="dry_run",
        action="store_false",
        help="Actually perform the upload",
    )
    parser.add_argument(
        "--model",
        default=None,
        help="Upload a single model by name (e.g. horse2zebra). Omit to upload all.",
    )
    args = parser.parse_args()

    print(f"Target repo  : {args.repo}")
    print(f"Checkpoints  : {CHECKPOINTS}")
    print(f"Dry run      : {args.dry_run}")
    print(f"Model filter : {args.model or 'all'}")
    print()

    upload_all(
        repo_id=args.repo,
        token=args.token,
        dry_run=args.dry_run,
        only_model=args.model,
    )


if __name__ == "__main__":
    main()
