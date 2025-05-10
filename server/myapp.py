import pickle
import pandas as pd
from flask import Flask, request, jsonify
import json
import sqlFunction
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the prediction model
try:
    pipe = pickle.load(open('pipe.pkl', 'rb'))
except Exception as e:
    print(f"Error loading model: {e}")
    pipe = None

@app.route('/api', methods=['POST'])
def api():
    data = request.get_json()
    prompt = data['prompt']
    
    # Your API logic here
    response = {
        "message": "Hello from the API!",
        "prompt": prompt
    }
    
    return jsonify(response)

@app.route('/sql', methods=['POST'])
def sql():
    data = request.get_json()
    query = data['query']
    
    # Call the SQL function
    response = sqlFunction.get_response(query)
    
    return jsonify({"response": response})

@app.route('/predict', methods=['POST'])
def predict():
    if pipe is None:
        return jsonify({"error": "Model not loaded properly"}), 500
    
    try:
        data = request.get_json()
        
        # Extract parameters from request
        batting_team = data.get('batting_team')
        bowling_team = data.get('bowling_team')
        selected_city = data.get('city')
        runs_left = data.get('runs_left')
        balls_left = data.get('balls_left')
        wickets = data.get('wickets')
        target = data.get('target')
        crr = data.get('crr')
        rrr = data.get('rrr')
        
        # Create DataFrame for prediction
        input_df = pd.DataFrame({
            'batting_team': [batting_team],
            'bowling_team': [bowling_team],
            'city': [selected_city],
            'runs_left': [runs_left],
            'balls_left': [balls_left],
            'wickets': [wickets],
            'total_runs_x': [target],
            'crr': [crr],
            'rrr': [rrr]
        })
        
        # Make prediction
        result = pipe.predict_proba(input_df)
        
        # Return prediction results
        return jsonify({
            'batting_team_win_probability': float(result[0][1]),
            'bowling_team_win_probability': float(result[0][0])
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
