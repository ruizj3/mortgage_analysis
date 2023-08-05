# backend/main.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/calculate', methods=['GET'])
def calculate():
    x = request.args.get('x', default = 0, type = int)
    z = request.args.get('z', default = 0, type = int)
    y = 3 * x + 4 + z  # calculate y based on x and z
    return jsonify({'y': y})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
