from typing import Tuple

import torch

from utils.data_loader import get_data_loaders


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


if __name__ == "__main__":
    verify_dataset_pipeline()
