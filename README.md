# StyleShift-AI 🎨

> **A modern, real-time web application for Unpaired Image-to-Image Translation powered by deep learning.**
> 
> Created and maintained by **[IMxMaYur](https://github.com/IMxMaYur)**.

---

## 🌟 Overview

**StyleShift-AI** is a robust and beautifully designed full-stack AI application that lets you seamlessly transform images across multiple domains (e.g., turning horses into zebras, summer landscapes into winter, or applying famous artistic styles to your photos) in real-time. 

Built with a lightning-fast **React / Vite** frontend and a powerful **Flask / PyTorch** backend, StyleShift-AI provides an elegant drag-and-drop workspace for exploring advanced generative adversarial networks (GANs) without touching a single line of code.

<p align="center">
  <img src="imgs/horse2zebra.gif" alt="StyleShift-AI Demo" width="500"/>
</p>

## ✨ Features

- **Real-Time Transformations:** Instantly apply complex neuro-style transfers.
- **Drag & Drop Workspace:** A deeply satisfying, modern UI built for ease of use.
- **GPU Accelerated:** Automatic CUDA detection for lightning-fast inference times.
- **Dynamic Model Loading:** Seamlessly drop new `.pth` checkpoints in the backend and watch them instantly appear in the React web app.

## ⚙️ Getting Started

### 1. Backend Setup (Flask + PyTorch)

StyleShift-AI requires a local Python environment. We recommend using `conda` or standard `pip` for dependency management.

```bash
# Clone the repository
git clone https://github.com/IMxMaYur/StyleShift-AI.git
cd StyleShift-AI

# Create a fresh Python 3.11 environment
conda create -n styleshift python=3.11 -y
conda activate styleshift

# Install the heavy ML dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install numpy==1.24.3 scikit-image dominate Pillow wandb flask flask-cors
```

### 2. Frontend Setup (React + Vite)

The UI was built with modern React.

```bash
cd frontend-react
npm install
```

## 🚀 Running the App

You will need two terminal windows open simultaneously.

**Terminal 1:** Start the Backend AI Engine
```bash
conda activate styleshift
python app.py
```
> The API will automatically boot up on `http://localhost:5000` and detect your GPU.

**Terminal 2:** Start the Frontend UI
```bash
cd frontend-react
npm run dev
```
> The web interface will spin up on `http://localhost:3000`. Open this in your browser to start shifting styles!

---

## 📦 Adding More Models

StyleShift-AI supports dozens of pre-trained transformations. To add more:
1. Use the provided download script: `bash ./scripts/download_cyclegan_model.sh monet2photo`
2. Make sure your `.pth` models are placed in `checkpoints/<model_name>_pretrained/latest_net_G.pth`.
3. Refresh the UI — the models will auto-populate!

---

<p align="center">
  Built with React & PyTorch. <br>
  Copyright © 2026 <strong>IMxMaYur</strong>. All rights reserved.
</p>
