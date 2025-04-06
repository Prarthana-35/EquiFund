from flask import Blueprint, request, jsonify
from models.credit_evaluation import CreditEvaluator
from models.lstm_model import LSTMCreditModel
import pandas as pd
import os

credit_bp = Blueprint('credit', __name__)
lstm_model = LSTMCreditModel()

@credit_bp.route('/evaluate', methods=['POST'])
def evaluate_credit():
    data = request.get_json()
    username = data.get('username')
    
    # 1. Get Twitter evaluation (existing)
    evaluator = CreditEvaluator()
    twitter_eval = evaluator.evaluate_twitter_profile(username)
    
    # 2. Get transaction history and LSTM prediction
    transaction_history = get_user_transactions(username)  # Implement this
    repayment_prob = lstm_model.predict_repayment_probability(transaction_history)
    
    # Combine results
    combined_score = calculate_combined_score(twitter_eval, repayment_prob)
    
    return jsonify({
        'data': {
            **twitter_eval,
            'repaymentProbability': repayment_prob,
            'combinedCreditScore': combined_score
        }
    })

def get_user_transactions(username):
    """Mock function - replace with actual transaction data retrieval"""
    # This should return a DataFrame with transaction history
    # Example columns: ['date', 'amount', 'type', 'balance_after', 'days_since_last_txn']
    return pd.DataFrame({
        'amount': np.random.uniform(10, 1000, 50),
        'balance_after': np.random.uniform(100, 10000, 50),
        'days_since_last_txn': np.random.randint(1, 30, 50),
        'repaid': np.random.choice([0, 1], 50, p=[0.2, 0.8])
    })

def calculate_combined_score(twitter_eval, repayment_prob):
    """Combine Twitter and LSTM scores"""
    twitter_weight = 0.4
    repayment_weight = 0.6
    return (twitter_eval['creditScore'] * twitter_weight + 
            repayment_prob * 850 * repayment_weight)