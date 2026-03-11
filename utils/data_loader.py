import os
from typing import Tuple

import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms


MEAN = (0.4914, 0.4822, 0.4465)
STD = (0.2470, 0.2435, 0.2616)


def _project_data_dir() -> str:
    """
    Resolve the dataset storage directory inside the repository.
    Returns a path like: <repo_root>/dataset/cifar10
    """
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
    data_dir = os.path.join(repo_root, "dataset", "cifar10")
    os.makedirs(data_dir, exist_ok=True)
    return data_dir


def _build_transforms() -> transforms.Compose:
    """
    Compose the preprocessing pipeline for CIFAR-10:
    - Resize to 32x32
    - Convert to tensor
    - Normalize with CIFAR-10 mean/std
    """
    return transforms.Compose(
        [
            transforms.Resize((32, 32)),
            transforms.ToTensor(),
            transforms.Normalize(mean=MEAN, std=STD),
        ]
    )


def get_data_loaders(
    batch_size: int = 32,
    num_workers: int = 2,
    pin_memory: bool = True,
) -> Tuple[DataLoader, DataLoader]:
    """
    Load CIFAR-10 training and test datasets and return PyTorch DataLoaders.

    Parameters
    ----------
    batch_size : int
        Batch size for the data loaders. Default is 32.
    num_workers : int
        Number of worker processes for data loading. On Windows, set to 0 if
        you encounter issues. Default is 2.
    pin_memory : bool
        Pin memory to speed up host-to-device transfer when using CUDA.

    Returns
    -------
    (train_loader, test_loader) : Tuple[DataLoader, DataLoader]
        DataLoaders for training and test splits.
    """
    data_dir = _project_data_dir()
    transform = _build_transforms()

    train_dataset = datasets.CIFAR10(
        root=data_dir,
        train=True,
        download=True,
        transform=transform,
    )
    test_dataset = datasets.CIFAR10(
        root=data_dir,
        train=False,
        download=True,
        transform=transform,
    )

    if torch.cuda.is_available():
        pin_memory = True

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )
    test_loader = DataLoader(
        test_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=pin_memory,
    )

    return train_loader, test_loader
