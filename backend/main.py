from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io
import os
from models.cnn_lstm_model import HybridCNNLSTMClassifier

app = FastAPI()

# CIFAR-10 classes
CLASS_NAMES = ["airplane", "automobile", "bird", "cat", "deer", "dog", "frog", "horse", "ship", "truck"]

# Global model variable
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "checkpoints", "cnn_lstm_model.pth")
        model = HybridCNNLSTMClassifier(num_classes=10)
        # Load weights on CPU
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        model.eval()
        print(f"Successfully loaded model from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")

def preprocess_image(file_bytes: bytes) -> torch.Tensor:
    """
    Accept raw image bytes, apply transforms, and return a batch tensor.
    """
    transform = transforms.Compose([
        transforms.Resize((32, 32)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.4914, 0.4822, 0.4465], std=[0.2023, 0.1994, 0.2010])
    ])
    
    image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    tensor = transform(image)
    return tensor.unsqueeze(0)  # Add batch dimension

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
    try:
        # Read and preprocess
        file_bytes = await file.read()
        input_tensor = preprocess_image(file_bytes)
        
        # Inference
        with torch.no_grad():
            logits = model(input_tensor)
            probabilities = F.softmax(logits, dim=1)
            
            # Get top prediction
            conf, idx = torch.max(probabilities, 1)
            label = CLASS_NAMES[idx.item()]
            confidence = conf.item()
            
            # Prepare all scores
            all_scores = {CLASS_NAMES[i]: probabilities[0][i].item() for i in range(len(CLASS_NAMES))}
            
            return {
                "label": label,
                "confidence": confidence,
                "all_scores": all_scores
            }
            
    except Exception as e:
        print(f"Inference error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

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

