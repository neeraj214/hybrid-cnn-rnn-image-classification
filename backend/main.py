from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import io
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

# Global model variable
model = None

def load_model():
    """
    Load the trained CNN-LSTM model weights.
    """
    try:
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "checkpoints", "cnn_lstm_model.pth")
        model_obj = HybridCNNLSTMClassifier(num_classes=10)
        # Load weights on CPU
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model_obj.load_state_dict(state_dict)
        model_obj.eval()
        print(f"Successfully loaded model from {model_path}")
        return model_obj
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

@app.on_event("startup")
async def startup_event():
    global model
    print("Application starting up...")
    model = load_model()
    if model is None:
        print("WARNING: Model failed to load!")
    else:
        print("Model loaded successfully and ready for inference.")

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/health")
def health():
    return {"status": "API running", "model_loaded": model is not None}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    print(f"Received prediction request for file: {file.filename}")
    if model is None:
        print("Error: Model not loaded")
        raise HTTPException(status_code=500, detail="Model not loaded on server.")
    
    try:
        # Read and preprocess
        file_bytes = await file.read()
        print(f"Read {len(file_bytes)} bytes")
        input_tensor = preprocess_image(file_bytes)
        print(f"Preprocessed image, input shape: {input_tensor.shape}")
        
        # Inference
        with torch.no_grad():
            logits = model(input_tensor)
            probabilities = F.softmax(logits, dim=1)
            
            # Get top prediction
            conf, idx = torch.max(probabilities, 1)
            label = CLASS_NAMES[idx.item()]
            confidence = conf.item()
            
            print(f"Prediction: {label} ({confidence:.2f})")
            
            # Prepare all scores
            all_scores = [probabilities[0][i].item() for i in range(len(CLASS_NAMES))]
            
            return {
                "label": label,
                "confidence": confidence,
                "all_scores": all_scores
            }
            
    except Exception as e:
        print(f"Inference error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")
