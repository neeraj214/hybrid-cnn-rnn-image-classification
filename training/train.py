from typing import Tuple
import os
import random
import torch
import torch.nn as nn
import torch.optim as optim

from utils.data_loader import get_data_loaders
from models.cnn_model import CNNFeatureExtractor
from models.rnn_model import convert_feature_map_to_sequence, FeatureSequenceLSTM
from models.cnn_lstm_model import HybridCNNLSTMClassifier
from visualization.plots import (
    plot_training_loss,
    plot_training_accuracy,
    plot_validation_accuracy,
)
import json
import numpy as np


def train():
    """
    Placeholder training entrypoint.
    Model training is intentionally deferred until later steps.
    """
    pass


def verify_dataset_pipeline() -> Tuple[int, int, torch.Size]:
    """
    Load CIFAR-10 via the data loader and print basic diagnostics.

    Returns
    -------
    (train_size, test_size, batch_shape)
    """
    train_loader, test_loader = get_data_loaders(batch_size=32)

    train_size = len(train_loader.dataset)
    test_size = len(test_loader.dataset)

    images, labels = next(iter(train_loader))
    batch_shape = images.shape

    print(f"Train dataset size: {train_size}")
    print(f"Test dataset size: {test_size}")
    print(f"Batch shape: {list(batch_shape)}")
    print("Data pipeline OK")

    return train_size, test_size, batch_shape


def verify_cnn_feature_extractor() -> torch.Size:
    """
    Pass one batch through the CNN feature extractor and print output shape.

    Returns
    -------
    torch.Size
        Feature map shape, expected: [32, 128, 4, 4]
    """
    train_loader, _ = get_data_loaders(batch_size=32)
    images, labels = next(iter(train_loader))

    print(f"Input shape: {list(images.shape)}")

    model = CNNFeatureExtractor()
    model.eval()
    with torch.no_grad():
        features = model(images)

    print(f"Feature map shape: {list(features.shape)}")
    print("CNN feature extractor OK")

    return features.shape


def verify_lstm_pipeline() -> torch.Size:
    """
    Full pipeline test:
    1) Load one batch
    2) CNN -> feature maps [B, 128, 4, 4]
    3) Convert to sequence [B, 16, 128]
    4) LSTM -> final hidden [B, 256]
    """
    train_loader, _ = get_data_loaders(batch_size=32)
    images, _ = next(iter(train_loader))
    print(f"Input shape: {list(images.shape)}")

    cnn = CNNFeatureExtractor()
    cnn.eval()
    with torch.no_grad():
        feature_maps = cnn(images)
    print(f"CNN feature map: {list(feature_maps.shape)}")

    # Reshape feature maps to sequence for LSTM
    sequence = convert_feature_map_to_sequence(feature_maps)
    print(f"Sequence tensor: {list(sequence.shape)}")

    lstm = FeatureSequenceLSTM()
    lstm.eval()
    with torch.no_grad():
        representation = lstm(sequence)
    print(f"LSTM output: {list(representation.shape)}")
    print("RNN pipeline OK")

    return representation.shape


def verify_hybrid_model() -> torch.Size:
    """
    End-to-end hybrid model test:
    Input -> CNN -> sequence -> LSTM -> classifier logits
    """
    train_loader, _ = get_data_loaders(batch_size=32)
    images, _ = next(iter(train_loader))
    print(f"Input shape: {list(images.shape)}")

    model = HybridCNNLSTMClassifier(num_classes=10)
    model.eval()
    with torch.no_grad():
        logits = model(images)
    print(f"Model output shape: {list(logits.shape)}")
    print("Hybrid model pipeline OK")

    return logits.shape


def train_one_epoch(
    model: nn.Module,
    loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    optimizer: optim.Optimizer,
    device: torch.device,
) -> Tuple[float, float]:
    """
    Single training epoch.
    """
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in loader:
        images = images.to(device)
        labels = labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        preds = outputs.argmax(dim=1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

    epoch_loss = running_loss / total
    epoch_acc = correct / total
    return epoch_loss, epoch_acc


def evaluate(
    model: nn.Module,
    loader: torch.utils.data.DataLoader,
    criterion: nn.Module,
    device: torch.device,
) -> Tuple[float, float]:
    """
    Validation step.
    """
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images = images.to(device, non_blocking=True)
            labels = labels.to(device, non_blocking=True)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

    val_loss = running_loss / total
    val_acc = correct / total
    return val_loss, val_acc


def run_training() -> None:
    """
    Execute the full training pipeline for the Hybrid CNN-LSTM model.
    """
    # Reproducibility
    seed = int(os.getenv("SEED", "42"))
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

    # Allow overriding epochs via environment variable for quick demos
    epochs = int(os.getenv("EPOCHS", "50"))
    batch_size = 32
    learning_rate = 0.001

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_loader, test_loader = get_data_loaders(batch_size=batch_size)
    model = HybridCNNLSTMClassifier(num_classes=10).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", patience=3, factor=0.5
    )

    best_val_acc = 0.0
    epochs_no_improve = 0
    early_stop_patience = 10
    history_train_loss = []
    history_train_acc = []
    history_val_loss = []
    history_val_acc = []

    for epoch in range(1, epochs + 1):
        current_lr = optimizer.param_groups[0]["lr"]
        print(f"Epoch {epoch}/{epochs} | LR: {current_lr:.6f}")
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        print(f"Train Loss: {train_loss:.4f} | Train Accuracy: {train_acc*100:.2f}% | LR: {current_lr:.6f}")

        val_loss, val_acc = evaluate(model, test_loader, criterion, device)
        print(f"Val Loss: {val_loss:.4f} | Val Accuracy: {val_acc*100:.2f}% | LR: {current_lr:.6f}")
        scheduler.step(val_loss)

        history_train_loss.append(train_loss)
        history_train_acc.append(train_acc)
        history_val_loss.append(val_loss)
        history_val_acc.append(val_acc)

        # Save best checkpoint based on validation accuracy
        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
            ckpt_dir = os.path.join(repo_root, "models", "checkpoints")
            os.makedirs(ckpt_dir, exist_ok=True)
            ckpt_path = os.path.join(ckpt_dir, "cnn_lstm_model.pth")
            torch.save(model.state_dict(), ckpt_path)
            print(f"Saved best model checkpoint to: {ckpt_path} (Val Acc: {best_val_acc*100:.2f}%)")
            epochs_no_improve = 0
        else:
            epochs_no_improve += 1

        # Early stopping based on validation accuracy
        if epochs_no_improve >= early_stop_patience:
            print(f"Early stopping triggered after {epoch} epochs. Best Val Acc: {best_val_acc*100:.2f}%")
            break

    # After training completes, save metrics and plots
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    metrics_path = os.path.join(repo_root, "training_metrics.json")
    metrics_payload = {
        "epochs": list(range(1, len(history_train_loss) + 1)),
        "train_loss": history_train_loss,
        "train_accuracy": history_train_acc,
        "val_loss": history_val_loss,
        "val_accuracy": history_val_acc,
        "best_val_accuracy": best_val_acc,
    }
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(metrics_payload, f, indent=2)
    print(f"Training metrics saved to: {metrics_path}")

    # Generate plots
    viz_dir = os.path.join(repo_root, "visualization")
    os.makedirs(viz_dir, exist_ok=True)
    plot_training_loss(history_train_loss, os.path.join(viz_dir, "training_loss.png"))
    plot_training_accuracy(history_train_acc, os.path.join(viz_dir, "training_accuracy.png"))
    plot_validation_accuracy(history_val_acc, os.path.join(viz_dir, "validation_accuracy.png"))
    print(f"Training plots saved to: {viz_dir}")


if __name__ == "__main__":
    verify_dataset_pipeline()
    verify_cnn_feature_extractor()
    verify_lstm_pipeline()
    verify_hybrid_model()
    run_training()
