# A Hybrid Deep Learning Approach for Image Classification using CNN and RNN

<div align="center">

<img src="https://img.shields.io/badge/python-3.x-blue.svg" alt="Python 3.x" />
<img src="https://img.shields.io/badge/PyTorch-2.x-ee4c2c?logo=pytorch&logoColor=white" alt="PyTorch" />
<img src="https://img.shields.io/badge/Torchvision-0.x-orange?logo=pytorch&logoColor=white" alt="Torchvision" />
<img src="https://img.shields.io/badge/dataset-CIFAR--10-ff8c00" alt="CIFAR-10" />
<img src="https://img.shields.io/github/last-commit/neeraj214/hybrid-cnn-rnn-image-classification" alt="Last Commit" />
<img src="https://img.shields.io/github/stars/neeraj214/hybrid-cnn-rnn-image-classification?style=social" alt="GitHub stars" />
<img src="https://img.shields.io/github/forks/neeraj214/hybrid-cnn-rnn-image-classification?style=social" alt="GitHub forks" />
<img src="https://img.shields.io/github/issues/neeraj214/hybrid-cnn-rnn-image-classification" alt="Open Issues" />
<img src="https://img.shields.io/github/issues-pr/neeraj214/hybrid-cnn-rnn-image-classification" alt="Open PRs" />
<img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />

</div>

---

## Project Description
Build a hybrid deep learning architecture that combines Convolutional Neural Networks (CNN) and Recurrent Neural Networks (RNN/LSTM) for image classification. The CNN acts as a feature extractor to capture spatial patterns from images, while the RNN/LSTM learns sequential relationships from the extracted feature maps. The initial target dataset is CIFAR‑10.

## Problem Statement
Standard CNNs excel at spatial feature extraction but may underutilize temporal or sequential relationships inherent in feature maps. The goal is to explore whether modeling ordered feature sequences improves classification performance and robustness on challenging image datasets.

## Proposed Architecture
- CNN backbone produces feature maps from input images
- Features are reshaped into sequences along spatial dimensions or channels
- RNN/LSTM processes the sequence to capture dependencies
- Final classification head outputs class probabilities

## Technology Stack
- Python 3.x
- PyTorch, Torchvision
- NumPy, Pandas
- Scikit‑learn
- Matplotlib, Seaborn
- Jupyter

## Initial Project Structure
```
hybrid-cnn-rnn-image-classification/
├── dataset/
├── models/
│   ├── __init__.py
│   ├── cnn_model.py
│   ├── rnn_model.py
│   └── cnn_lstm_model.py
├── training/
│   ├── __init__.py
│   └── train.py
├── evaluation/
│   ├── __init__.py
│   └── evaluate.py
├── visualization/
│   ├── __init__.py
│   └── plots.py
├── utils/
│   ├── __init__.py
│   └── data_loader.py
├── notebooks/
│   └── experiments.ipynb
├── requirements.txt
├── .gitignore
└── README.md
```

Implementation begins after environment setup and structure initialization. Model development is intentionally deferred.

---

## Badges Quick Links
- Stars: https://github.com/neeraj214/hybrid-cnn-rnn-image-classification/stargazers
- Forks: https://github.com/neeraj214/hybrid-cnn-rnn-image-classification/network/members
- Issues: https://github.com/neeraj214/hybrid-cnn-rnn-image-classification/issues
- Pull Requests: https://github.com/neeraj214/hybrid-cnn-rnn-image-classification/pulls

## Contributing
Contributions are welcome! Please open an issue to discuss changes or submit a pull request.

---

## How to Run Training

1. Create and activate a virtual environment

   Windows PowerShell:
   ```
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

2. Install dependencies
   ```
   python -m pip install -r requirements.txt
   ```

3. Run the training script
   ```
   python -m training.train
   ```

Notes:
- The CIFAR‑10 dataset is automatically downloaded to [dataset](file:///c:/Users/neera/CNN%20and%20RNN/hybrid-cnn-rnn-image-classification/dataset).
- Model checkpoints are saved to [models/checkpoints](file:///c:/Users/neera/CNN%20and%20RNN/hybrid-cnn-rnn-image-classification/models/checkpoints).
- On Windows, if you encounter DataLoader worker issues, set `num_workers=0` in `get_data_loaders`.
