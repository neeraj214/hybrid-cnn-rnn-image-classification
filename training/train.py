from typing import Tuple
import os
import torch
import torch.nn as nn
import torch.optim as optim

from utils.data_loader import get_data_loaders
from models.cnn_model import CNNFeatureExtractor
from models.rnn_model import convert_feature_map_to_sequence, FeatureSequenceLSTM
from models.cnn_lstm_model import HybridCNNLSTMClassifier


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
            images = images.to(device)
            labels = labels.to(device)
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
    epochs = 20
    batch_size = 32
    learning_rate = 0.001

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_loader, test_loader = get_data_loaders(batch_size=batch_size)
    model = HybridCNNLSTMClassifier(num_classes=10).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    for epoch in range(1, epochs + 1):
        print(f"Epoch {epoch}/{epochs}")
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device)
        print(f"Train Loss: {train_loss:.4f} | Train Accuracy: {train_acc*100:.2f}%")

        val_loss, val_acc = evaluate(model, test_loader, criterion, device)
        print(f"Val Loss: {val_loss:.4f} | Val Accuracy: {val_acc*100:.2f}%")

    # Save checkpoint
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    ckpt_dir = os.path.join(repo_root, "models", "checkpoints")
    os.makedirs(ckpt_dir, exist_ok=True)
    ckpt_path = os.path.join(ckpt_dir, "cnn_lstm_model.pth")
    torch.save(model.state_dict(), ckpt_path)
    print(f"Model saved to: {ckpt_path}")


if __name__ == "__main__":
    verify_dataset_pipeline()
    verify_cnn_feature_extractor()
    verify_lstm_pipeline()
    verify_hybrid_model()
    run_training()
