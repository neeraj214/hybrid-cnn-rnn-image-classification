import os
from typing import Tuple, List

import torch
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

from models.cnn_lstm_model import HybridCNNLSTMClassifier
from utils.data_loader import get_data_loaders, MEAN, STD


CLASS_NAMES = [
    "airplane",
    "automobile",
    "bird",
    "cat",
    "deer",
    "dog",
    "frog",
    "horse",
    "ship",
    "truck",
]


def _ensure_dir(path: str) -> None:
    """
    Create directory if it doesn't exist.
    """
    os.makedirs(path, exist_ok=True)


def load_model(checkpoint_path: str, device: torch.device) -> HybridCNNLSTMClassifier:
    """
    Load trained HybridCNNLSTMClassifier from checkpoint.
    """
    model = HybridCNNLSTMClassifier(num_classes=10).to(device)
    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    return model


def evaluate_model(
    model: torch.nn.Module, loader: torch.utils.data.DataLoader, device: torch.device
) -> Tuple[float, float, float, float, np.ndarray, np.ndarray]:
    """
    Run inference on the test set and compute metrics.

    Returns
    -------
    (acc, precision, recall, f1, y_true, y_pred)
    """
    y_true: List[int] = []
    y_pred: List[int] = []

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device)
            outputs = model(images)
            preds = outputs.argmax(dim=1).cpu().numpy()
            y_pred.extend(preds.tolist())
            y_true.extend(labels.cpu().numpy().tolist())

    acc = accuracy_score(y_true, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="macro", zero_division=0
    )
    return acc, precision, recall, f1, np.array(y_true), np.array(y_pred)


def save_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray, out_path: str) -> None:
    """
    Generate and save a confusion matrix heatmap.
    """
    _ensure_dir(os.path.dirname(out_path))
    cm = confusion_matrix(y_true, y_pred, labels=list(range(10)))
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=CLASS_NAMES, yticklabels=CLASS_NAMES)
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.title("Confusion Matrix - CIFAR-10")
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()


def _denormalize(img: torch.Tensor) -> np.ndarray:
    """
    Denormalize an image tensor and convert to HWC numpy array for plotting.
    """
    mean = torch.tensor(MEAN).view(3, 1, 1)
    std = torch.tensor(STD).view(3, 1, 1)
    img = img.clone().cpu() * std + mean
    img = torch.clamp(img, 0.0, 1.0)
    return img.permute(1, 2, 0).numpy()


def save_sample_predictions(
    model: torch.nn.Module,
    loader: torch.utils.data.DataLoader,
    device: torch.device,
    out_path: str,
    num_samples: int = 16,
) -> None:
    """
    Save a grid of sample predictions with true labels.
    """
    _ensure_dir(os.path.dirname(out_path))

    images, labels = next(iter(loader))
    images = images.to(device)

    with torch.no_grad():
        logits = model(images)
        preds = logits.argmax(dim=1).cpu().numpy()

    count = min(num_samples, images.size(0))
    cols = int(np.sqrt(count))
    rows = int(np.ceil(count / cols))

    plt.figure(figsize=(2.5 * cols, 2.5 * rows))
    for i in range(count):
        plt.subplot(rows, cols, i + 1)
        img = _denormalize(images[i])
        plt.imshow(img)
        plt.axis("off")
        plt.title(f"P: {CLASS_NAMES[preds[i]]}\nT: {CLASS_NAMES[labels[i].item()]}", fontsize=8)
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()


def main() -> None:
    """
    Entry point: load model, run evaluation, and save visualizations.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    ckpt_path = os.path.join(repo_root, "models", "checkpoints", "cnn_lstm_model.pth")

    if not os.path.exists(ckpt_path):
        print(f"Checkpoint not found at: {ckpt_path}")
        print("Please run training first: python -m training.train")
        return

    _, test_loader = get_data_loaders(batch_size=32)
    model = load_model(ckpt_path, device)

    acc, precision, recall, f1, y_true, y_pred = evaluate_model(model, test_loader, device)

    print(f"Test Accuracy: {acc*100:.2f}%")
    print(f"Precision (macro): {precision*100:.2f}%")
    print(f"Recall (macro): {recall*100:.2f}%")
    print(f"F1 Score (macro): {f1*100:.2f}%")

    cm_out = os.path.join(repo_root, "visualization", "confusion_matrix.png")
    save_confusion_matrix(y_true, y_pred, cm_out)

    samples_out = os.path.join(repo_root, "visualization", "sample_predictions.png")
    save_sample_predictions(model, test_loader, device, samples_out, num_samples=16)


if __name__ == "__main__":
    main()
