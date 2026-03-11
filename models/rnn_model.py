import torch
import torch.nn as nn


def convert_feature_map_to_sequence(features: torch.Tensor) -> torch.Tensor:
    """
    Convert CNN feature maps [B, 128, 4, 4] to sequences [B, 16, 128].

    The 4x4 spatial grid is flattened to a sequence length of 16, and
    the 128 channels become the feature dimension at each timestep.

    Parameters
    ----------
    features : torch.Tensor
        Input tensor of shape [batch_size, 128, 4, 4].

    Returns
    -------
    torch.Tensor
        Output tensor of shape [batch_size, 16, 128].
    """
    b, c, h, w = features.shape
    # Reshape: [B, C, H, W] -> [B, C, H*W]
    seq = features.view(b, c, h * w)
    # Permute to sequence-first: [B, C, 16] -> [B, 16, C]
    seq = seq.permute(0, 2, 1).contiguous()
    return seq


class FeatureSequenceLSTM(nn.Module):
    """
    LSTM over feature sequences produced from CNN feature maps.

    Input:  [B, 16, 128]  (batch_first=True)
    LSTM:   input_size=128, hidden_size=256, num_layers=1
    Output: final hidden state [B, 256]
    """

    def __init__(self, input_size: int = 128, hidden_size: int = 256, num_layers: int = 1) -> None:
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Parameters
        ----------
        x : torch.Tensor
            Sequence tensor of shape [B, 16, 128].

        Returns
        -------
        torch.Tensor
            Final hidden state of shape [B, 256].
        """
        _, (h_n, _) = self.lstm(x)
        # h_n: [num_layers, B, hidden_size] -> select last layer, squeeze
        return h_n[-1]
