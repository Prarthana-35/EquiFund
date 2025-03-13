**EmpowHer: Financial Empowerment Platform**

EmpowHer is a financial empowerment platform designed to help users manage their finances, track expenses, analyze investments, and predict stock prices. The platform provides tools for budgeting, investment analysis, and stock price forecasting using machine learning models.

# 1. Expense Tracking
Visualize Expenses: View your expenses in a pie chart or bar graph.

Track Spending: Add and categorize expenses to monitor your spending habits.

# 2. Investment Analysis
ROI Calculation: Calculate the return on investment (ROI) for a given stock over a specified period.

Volatility Analysis: Measure the annualized volatility of a stock to assess risk.

# 3. Stock Price Prediction
LSTM Model: Predict future stock prices using a Long Short-Term Memory (LSTM) neural network.

Linear Regression: Predict future stock prices using a simple Linear Regression model.

# 4. User Authentication
Sign Up/Log In: Securely register and log in to your account.

Protected Routes: Access protected routes using JWT (JSON Web Tokens).

**Technologies Used**

Frontend
React: A JavaScript library for building user interfaces.

Redux: For state management.

Axios: For making HTTP requests to the backend.

Chart.js: For visualizing expense and investment data.

Backend
Flask: A lightweight Python web framework.

MongoDB: A NoSQL database for storing user and financial data.

Firebase: For user authentication.

yFinance: For fetching real-time stock data.

Scikit-learn: For machine learning models (Linear Regression).

Keras/TensorFlow: For building and training the LSTM model.

**Setup Instructions**
1. Clone the Repository
bash
Copy
git clone https://github.com/Prarthana-35/empowHer.git
cd empowHer
2. Backend Setup
Navigate to the backend folder:

bash
Copy
cd backend
Install Python dependencies:

bash
Copy
pip install -r requirements.txt
Set up environment variables:

Create a .env file in the backend folder.

Add the following variables:

plaintext
Copy
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>

Run the Flask server:

bash
Copy
python analysis.py
3. Frontend Setup
Navigate to the financial-app folder:

bash
Copy
cd financial-app
Install Node.js dependencies:

bash
Copy
npm install
Run the React app:

bash
Copy
npm start