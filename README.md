# A Hybrid Deep Learning Approach for Image Classification using CNN and RNN

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
