import torch
import torch.nn as nn

from models.cnn_model import CNNFeatureExtractor
from models.rnn_model import convert_feature_map_to_sequence, FeatureSequenceLSTM


class HybridCNNLSTMClassifier(nn.Module):
    """
    Hybrid model: CNN feature extractor -> sequence -> LSTM -> classifier

    Input:  images [B, 3, 32, 32]
    CNN -> feature maps [B, 128, 4, 4]
    Sequence conversion -> [B, 16, 128]
    LSTM -> representation [B, 256]
    Classifier -> logits [B, 10]
    """

    def __init__(self, num_classes: int = 10) -> None:
        super().__init__()
        # CNN backbone
        self.cnn = CNNFeatureExtractor()
        # Dropout after CNN feature maps
        self.dropout_cnn = nn.Dropout2d(p=0.3)
        # LSTM over feature sequences
        self.rnn = FeatureSequenceLSTM(input_size=128, hidden_size=256, num_layers=1)
        # Classification head: 256 -> 128 -> 10
        self.classifier = nn.Sequential(
            nn.Linear(256, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(p=0.5),
            nn.Linear(128, num_classes),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass through the hybrid architecture.

        Parameters
        ----------
        x : torch.Tensor
            Input images of shape [B, 3, 32, 32].

        Returns
        -------
        torch.Tensor
            Logits of shape [B, 10].
        """
        # Stage 1: CNN feature extraction
        feature_maps = self.cnn(x)
        feature_maps = self.dropout_cnn(feature_maps)
        # Stage 2: reshape feature maps to sequence for RNN
        sequence = convert_feature_map_to_sequence(feature_maps)
        # Stage 3: LSTM to produce sequence representation
        representation = self.rnn(sequence)
        # Stage 4: classification head (no softmax; use CrossEntropyLoss later)
        logits = self.classifier(representation)
        return logits
