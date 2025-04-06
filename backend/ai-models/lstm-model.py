import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

from sklearn.neural_network import MLPClassifier

class SimpleCreditModel:
    def __init__(self):
        self.model = MLPClassifier(
            hidden_layer_sizes=(64, 32),
            activation='relu',
            solver='adam',
            max_iter=100
        )
        self.scaler = MinMaxScaler()
    
    def preprocess_data(self, data):
        """Prepare data for MLP"""
        features = data[['amount', 'balance_after', 'days_since_last_txn']].values
        return self.scaler.fit_transform(features), data['repaid'].values
    
    def train(self, transaction_data):
        X, y = self.preprocess_data(transaction_data)
        self.model.fit(X, y)
    
    def predict_repayment_probability(self, transaction_history):
        """Predict repayment probability"""
        X, _ = self.preprocess_data(transaction_history)
        if len(X) == 0:
            return 0.5
        return float(np.mean(self.model.predict_proba(X)[:, 1][-5:]))

CreditModel = SimpleCreditModel  