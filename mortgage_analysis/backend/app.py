from flask import Flask, request, jsonify
from flask_cors import CORS
from mortgage_check import mortgage_check
app = Flask(__name__)
CORS(app)

@app.route('/data', methods=['GET'])
def data():
    x_values = list(range(10))  # [0, 1, 2, ..., 9]
    y_values = [3 * x + 4 for x in x_values]  # y = 3x + 4
    data = list(zip(x_values, y_values))  # [(0, 4), (1, 7), ..., (9, 31)]
    return jsonify(data)
@app.route('/mortgage')
def mortgage_check_route():
    principal = request.args.get('principal', type=float)
    down_payment = request.args.get('down_payment_percent', type=float)
    rate = request.args.get('rate', type=float)
    years = request.args.get('years', type=int)
    compound = request.args.get('compound', type=int)

    if principal and down_payment and rate and years and compound:
        data = mortgage_check(principal, down_payment, rate, years, compound)
        
    else:
        data = mortgage_check()
        
    return data

if __name__ == '__main__':
    app.run(debug=True, port=5000)
