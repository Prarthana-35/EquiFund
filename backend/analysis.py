from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import yfinance as yf
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from datetime import datetime

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={
    r"/analyze": {"origins": "http://localhost:5173", "supports_credentials": True},
    r"/predict": {"origins": "http://localhost:5173", "supports_credentials": True}
})

# Function to fetch stock data dynamically
def get_stock_data(stock_name):
    stock = yf.Ticker(stock_name)
    dataset = stock.history(start='2021-01-01')
    if dataset.empty:
        raise ValueError(f"No data found for ticker: {stock_name}")
    dataset.index = pd.to_datetime(dataset.index)  # Ensure the index is a DatetimeIndex
    dataset['SMA_20'] = dataset['Close'].rolling(window=20).mean()
    dataset['SMA_10'] = dataset['Close'].rolling(window=10).mean()
    dataset['SMA_5'] = dataset['Close'].rolling(window=5).mean()
    dataset['EMA_20'] = dataset['Close'].ewm(span=20, adjust=False).mean()
    dataset['EMA_10'] = dataset['Close'].ewm(span=10, adjust=False).mean()
    dataset['EMA_5'] = dataset['Close'].ewm(span=5, adjust=False).mean()
    delta = dataset['Close'].diff(1)
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    rs = avg_gain / avg_loss
    dataset['RSI_14'] = 100 - (100 / (1 + rs))
    dataset['STD_20'] = dataset['Close'].rolling(window=20).std()
    dataset['Upper_BB'] = dataset['SMA_20'] + (2 * dataset['STD_20'])
    dataset['Lower_BB'] = dataset['SMA_20'] - (2 * dataset['STD_20'])
    dataset['EMA_12'] = dataset['Close'].ewm(span=12, adjust=False).mean()
    dataset['EMA_26'] = dataset['Close'].ewm(span=26, adjust=False).mean()
    dataset['MACD'] = dataset['EMA_12'] - dataset['EMA_26']
    dataset['MACD_Signal'] = dataset['MACD'].ewm(span=9, adjust=False).mean()
    dataset.dropna(inplace=True)
    return dataset

# Function to predict using ARIMA
def predict_with_arima(data, days):
    # Fit ARIMA model
    model = ARIMA(data['Close'], order=(5, 1, 0))  # ARIMA(p, d, q)
    model_fit = model.fit()
    # Forecast future prices
    forecast = model_fit.forecast(steps=days)
    return forecast.tolist()

# Analyze endpoint
@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify(), 200
    data = request.get_json()
    ticker = data['ticker']
    start_date = data['start_date']
    end_date = data['end_date']
    try:
        stock_data = get_stock_data(ticker)
        stock_data = stock_data.loc[start_date:end_date]
        if stock_data.empty:
            return jsonify({"error": "No data found for the given date range"}), 400
        roi = ((stock_data['Close'].iloc[-1] - stock_data['Close'].iloc[0]) / stock_data['Close'].iloc[0]) * 100
        volatility = stock_data['Close'].pct_change().std() * np.sqrt(252)
        # Log the results
        print(f"Ticker: {ticker}, ROI: {roi}, Volatility: {volatility}")
        return jsonify({
            "roi": roi,
            "ticker": ticker,
            "volatility": volatility
        })
    except ValueError as e:
        print(f"Error analyzing {ticker}: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 400

# Predict endpoint
@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify(), 200
    data = request.get_json()
    ticker = data['ticker']
    days = int(data['days'])
    try:
        stock_data = get_stock_data(ticker)
        future_prices = predict_with_arima(stock_data, days)
        # Log the results
        print(f"Ticker: {ticker}, Future Prices: {future_prices}")
        return jsonify({
            "future_prices": future_prices
        })
    except ValueError as e:
        print(f"Error predicting {ticker}: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)