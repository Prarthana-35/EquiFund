from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pandas as pd
import numpy as np
import yfinance as yf
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import sys
print(sys.path)

app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
# CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route('/')
def home():
    return "Welcome to the Investment Analysis API!"

def get_stock_data(stock_name):
    stock = yf.Ticker(stock_name)
    dataset = stock.history(start = '2021-01-01')
    dataset['SMA_20'] = dataset['Close'].rolling(window=20).mean()
    dataset['SMA_10'] = dataset['Close'].rolling(window=10).mean()
    dataset['SMA_5'] = dataset['Close'].rolling(window=5).mean()
    dataset['EMA_20'] = dataset['Close'].ewm(span=20, adjust=False).mean()
    dataset['EMA_10'] = dataset['Close'].ewm(span=10, adjust=False).mean()
    dataset['EMA_5'] = dataset['Close'].ewm(span=5, adjust=False).mean()
    delta = dataset['Close'].diff(1)  # Calculate price changes
    gain = delta.where(delta > 0, 0)  # Keep only gains (positive changes)
    loss = -delta.where(delta < 0, 0)  # Keep only losses (negative changes)

    # Calculate the average gain and average loss
    avg_gain = gain.rolling(window=14).mean()
    avg_loss = loss.rolling(window=14).mean()
    
    rs = avg_gain / avg_loss

    # Calculate the RSI
    dataset['RSI_14'] = 100 - (100 / (1 + rs))

    dataset['STD_20'] = dataset['Close'].rolling(window=20).std()

    # Calculate the upper and lower Bollinger Bands
    dataset['Upper_BB'] = dataset['SMA_20'] + (2 * dataset['STD_20'])
    dataset['Lower_BB'] = dataset['SMA_20'] - (2 * dataset['STD_20'])
        
     # Calculate the 12-day and 26-day EMA
    dataset['EMA_12'] = dataset['Close'].ewm(span=12, adjust=False).mean()
    dataset['EMA_26'] = dataset['Close'].ewm(span=26, adjust=False).mean()

    # Calculate the MACD line
    dataset['MACD'] = dataset['EMA_12'] - dataset['EMA_26']

    # Calculate the MACD s ignal line (9-day EMA of MACD)
    dataset['MACD_Signal'] = dataset['MACD'].ewm(span=9, adjust=False).mean()

    dataset.dropna(inplace = True)
    return dataset


def model_LSTM(data):
    data = data.dropna()
    index = data.index
    #Normalisation of Columns
    feature = ['Close', 'SMA_20', 'MACD', 'RSI_14']
    data = data[feature]

    data['Close_1'] = data['Close'].shift(1)
    data['Close_2'] = data['Close'].shift(2)
    data['Close_3'] = data['Close'].shift(3)
    
    data.dropna(inplace=True)
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data[['Close', 'SMA_20', 'MACD', 'RSI_14', 'Close_1', 'Close_2', 'Close_3']])
    # Reshaping Data For LSTM
    X = []
    y = []
    time_steps = 60
    for i in range(time_steps, len(scaled_data)):
        X.append(scaled_data[i-time_steps:i, :])
        y.append(scaled_data[i, 0])

    X,y = np.array(X), np.array(y)
    features = ['Close', 'SMA_20', 'MACD', 'RSI_14', 'Close_1', 'Close_2', 'Close_3']
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], len(features)))
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], len(features)))
    # Defining Model
    model = Sequential()
    model.add(LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])))
    model.add(Dropout(0.2))
    model.add(LSTM(50, return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(25))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    model.fit(X_train, y_train, batch_size=1, epochs=5)
    # Forecasting price
    predictions = model.predict(X_test)

    last_60_days_data = data.tail(60) 
    scaled_last_data = scaler.transform(last_60_days_data[['Close', 'SMA_20', 'MACD', 'RSI_14', 'Close_1', 'Close_2', 'Close_3']])

    X_today = []
    X_today.append(scaled_last_data)
    X_today = np.array(X_today)
    predicted_today = model.predict(X_today)
    predicted_today_price = scaler.inverse_transform([[predicted_today[0][0], 0, 0, 0, 0, 0, 0]])[0][0]
    dummy_array = np.zeros((predictions.shape[0], len(features)))  # Same number of features as scaler
    y_dummy_array = np.zeros((y_test.shape[0], len(features)))
    # Assign predictions to the first column
    dummy_array[:, 0] = predictions.flatten()  # Flatten to convert (n, 1) to (n,)
    y_dummy_array[:, 0] = y_test.flatten()
    # Inverse transform the predictions
    actual_predictions = scaler.inverse_transform(dummy_array)[:, 0]
    actual_values = scaler.inverse_transform(y_dummy_array)[:, 0]
    print(f"Predicted closing price for today: {predicted_today_price}")
    return actual_predictions, actual_values, predicted_today_price, index


def calculate_roi(prices):
    initial_price = prices.iloc[0]
    final_price = prices.iloc[-1]
    roi = (final_price - initial_price) / initial_price * 100
    return float(roi)  # Convert to float

def calculate_volatility(prices):
    daily_returns = prices.pct_change().dropna()
    volatility = daily_returns.std() * np.sqrt(252)  # Annualized volatility
    return float(volatility)  # Convert to float

@app.route('/analyze', methods=['POST', 'GET'])
def analyze():
    if request.method == 'POST':
        # Handle POST Request
        data = request.json
        print("Received data:", data)  # Debugging line
        ticker = data['ticker']
        start_date = data['start_date']
        end_date = data['end_date']

        # Fetch historical data
        stock_data = yf.download(ticker, start=start_date, end=end_date)
        prices = stock_data['Close']

        # Calculate metrics
        roi = calculate_roi(prices)
        volatility = calculate_volatility(prices)

        return jsonify({
            'ticker': ticker,
            'roi': roi,
            'volatility': volatility,
        })

    elif request.method == 'GET':
        # Hardcoded data for testing in browser
        sample_data = {
            'ticker': 'AAPL',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31'
        }

        # Fetch historical data
        stock_data = yf.download(sample_data['ticker'], start=sample_data['start_date'], end=sample_data['end_date'])
        prices = stock_data['Close']

        # Calculate metrics
        roi = calculate_roi(prices)
        volatility = calculate_volatility(prices)

        return jsonify({
            'ticker': sample_data['ticker'],
            'roi': roi,
            'volatility': volatility,
        })

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    if request.method == 'POST':
        # Handle POST Request
        data = request.json
        print("Received data:", data)  # Debugging line
        ticker = data['ticker']
        days = int(data['days'])

        # Fetch historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)  # 1 year of data
        stock_data = yf.download(ticker, start=start_date, end=end_date)
        prices = stock_data['Close'].values.reshape(-1, 1)

        # Prepare data for prediction
        X = np.arange(len(prices)).reshape(-1, 1)
        y = prices

        # Train a Linear Regression model
        model = LinearRegression()
        model.fit(X, y)

        # Predict future prices
        future_X = np.arange(len(prices), len(prices) + days).reshape(-1, 1)
        future_prices = model.predict(future_X)

        return jsonify({
            'ticker': ticker,
            'future_prices': future_prices.flatten().tolist(),
        })

    elif request.method == 'GET':
        # Hardcoded data for testing in browser
        sample_data = {
            'ticker': 'AAPL',
            'days': 7  # Predicting next 7 days
        }

        # Fetch historical data
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)  # 1 year of data
        stock_data = yf.download(sample_data['ticker'], start=start_date, end=end_date)
        prices = stock_data['Close'].values.reshape(-1, 1)

        # Prepare data for prediction
        X = np.arange(len(prices)).reshape(-1, 1)
        y = prices

        # Train a Linear Regression model
        model = LinearRegression()
        model.fit(X, y)

        # Predict future prices
        future_X = np.arange(len(prices), len(prices) + sample_data['days']).reshape(-1, 1)
        future_prices = model.predict(future_X)

        return jsonify({
            'ticker': sample_data['ticker'],
            'future_prices': future_prices.flatten().tolist(),
        })

if __name__ == '__main__':
    app.run(port=5000)