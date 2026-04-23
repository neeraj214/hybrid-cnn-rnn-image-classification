from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import sys, os

# Add parent directory to path for model imports
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))
from models.cnn_lstm_model import HybridCNNLSTMClassifier

app = FastAPI()

# CIFAR-10 classes
CLASS_NAMES = [
  "airplane", "automobile", "bird", "cat", "deer",
  "dog", "frog", "horse", "ship", "truck"
]

def load_model():
    """
    Load the trained CNN-LSTM model weights.
    """
    try:
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "checkpoints", "cnn_lstm_model.pth")
        model = HybridCNNLSTMClassifier(num_classes=10)
        # Load weights on CPU
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        model.eval()
        print(f"Successfully loaded model from {model_path}")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Load model at module level
model = load_model()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "API running"}
