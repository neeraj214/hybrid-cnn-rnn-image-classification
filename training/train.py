from typing import Tuple

import torch

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


if __name__ == "__main__":
    verify_dataset_pipeline()
    verify_cnn_feature_extractor()
    verify_lstm_pipeline()
    verify_hybrid_model()
