# Hybrid CNN-RNN Image Classification System

[![Python 3.12](https://img.shields.io/badge/python-3.12-blue.svg)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.x-ee4c2c?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.x-05998b?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 1. Project Overview
This project implements a state-of-the-art hybrid deep learning architecture designed for robust image classification on the **CIFAR-10** dataset. By combining **Convolutional Neural Networks (CNN)** for high-level spatial feature extraction and **Recurrent Neural Networks (RNN/LSTM)** for modeling sequential dependencies within feature maps, the system achieves superior performance compared to traditional standalone models.

## 2. Model Performance
After extensive training over 50 epochs using GPU acceleration:
- **Best Validation Accuracy**: `80.15%`
- **Dataset**: CIFAR-10 (60,000 32x32 color images in 10 classes)
- **Training Strategy**: Cross-Entropy Loss with Adam Optimizer and learning rate scheduling.

## 3. Project Structure
```text
hybrid-cnn-rnn-image-classification/
├── backend/            # FastAPI server, inference logic, and API endpoints
├── frontend/           # React (Vite) dashboard with Tailwind CSS
├── models/             # PyTorch model definitions (CNN, RNN, Hybrid)
│   └── checkpoints/    # Trained model weights (.pth)
├── training/           # Training scripts and loss/accuracy tracking
├── evaluation/         # Model testing and metric generation
├── visualization/      # Generated plots and performance graphs
├── utils/              # Data loaders and preprocessing helpers
├── dataset/            # CIFAR-10 raw data (auto-downloaded)
└── requirements.txt    # Project dependencies
```

## 4. How to Run Locally

### Prerequisites
- Python 3.12+
- Node.js & npm

### Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/neeraj214/hybrid-cnn-rnn-image-classification.git
   cd hybrid-cnn-rnn-image-classification
   ```

2. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Backend (FastAPI)**:
   ```bash
   cd backend
   # Set PYTHONPATH to root for model imports
   $env:PYTHONPATH=".." # Windows PowerShell
   uvicorn main:app --reload --port 8000
   ```
   *The API will be available at `http://localhost:8000`. Access `/docs` for Swagger UI.*

4. **Start the Frontend (React + Vite)**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:5173`.*

## 5. Tech Stack
- **Deep Learning**: PyTorch, Torchvision
- **Backend**: FastAPI, Uvicorn, Axios (for API tests)
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React
- **Data Science**: NumPy, Matplotlib, PIL

## 6. Dataset
The system uses the **CIFAR-10** dataset, which consists of 60,000 color images in 10 mutually exclusive classes:
- `airplane`, `automobile`, `bird`, `cat`, `deer`, `dog`, `frog`, `horse`, `ship`, `truck`

The dataset is automatically handled and downloaded by the `utils/data_loader.py` script upon first execution.

---
*Developed by [Neeraj Negi](https://github.com/neeraj214)*
