import os
from typing import List

import matplotlib.pyplot as plt


def _ensure_dir(path: str) -> None:
    """
    Create directory if it doesn't exist.
    """
    os.makedirs(path, exist_ok=True)


def plot_training_loss(losses: List[float], out_path: str) -> None:
    """
    Plot training loss vs epoch and save to file.
    """
    _ensure_dir(os.path.dirname(out_path))
    epochs = list(range(1, len(losses) + 1))
    plt.figure()
    plt.plot(epochs, losses, marker="o")
    plt.xlabel("Epoch")
    plt.ylabel("Training Loss")
    plt.title("Training Loss vs Epoch")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()


def plot_training_accuracy(accs: List[float], out_path: str) -> None:
    """
    Plot training accuracy vs epoch and save to file.
    """
    _ensure_dir(os.path.dirname(out_path))
    epochs = list(range(1, len(accs) + 1))
    plt.figure()
    plt.plot(epochs, [a * 100 for a in accs], marker="o")
    plt.xlabel("Epoch")
    plt.ylabel("Training Accuracy (%)")
    plt.title("Training Accuracy vs Epoch")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()


def plot_validation_accuracy(accs: List[float], out_path: str) -> None:
    """
    Plot validation accuracy vs epoch and save to file.
    """
    _ensure_dir(os.path.dirname(out_path))
    epochs = list(range(1, len(accs) + 1))
    plt.figure()
    plt.plot(epochs, [a * 100 for a in accs], marker="o")
    plt.xlabel("Epoch")
    plt.ylabel("Validation Accuracy (%)")
    plt.title("Validation Accuracy vs Epoch")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(out_path)
    plt.close()
