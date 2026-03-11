import torch
import torch.nn as nn


class CNNFeatureExtractor(nn.Module):
    """
    Convolutional feature extractor for images of shape [B, 3, 32, 32].

    Architecture
    -----------
    - Conv2d(3 -> 32, kernel=3, padding=1) + ReLU
    - MaxPool2d(2x2)
    - Conv2d(32 -> 64, kernel=3, padding=1) + ReLU
    - MaxPool2d(2x2)
    - Conv2d(64 -> 128, kernel=3, padding=1) + ReLU
    - MaxPool2d(2x2)

    Output feature map: [B, 128, 4, 4]
    """

    def __init__(self) -> None:
        super().__init__()
        self.features = nn.Sequential(
            # Block 1: keep spatial size via padding, then downsample with pool
            nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            # Block 2
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            # Block 3
            nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Forward pass through the feature extractor.

        Parameters
        ----------
        x : torch.Tensor
            Input tensor of shape [B, 3, 32, 32].

        Returns
        -------
        torch.Tensor
            Feature map of shape [B, 128, 4, 4].
        """
        return self.features(x)
