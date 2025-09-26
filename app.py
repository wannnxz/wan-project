from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import csv, os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allow requests from frontend

CSV_FILE = "locations.csv"
FIELDS = ['received_at','latitude','longitude','accuracy','timestamp','consent_given','note']

if not os.path.exists(CSV_FILE):
    with open(CSV_FILE,'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()

@app.route('/')
def root():
    return "Location receiver running."

@app.route('/location', methods=['POST'])
def location():
    data = request.get_json()
    if not data:
        return jsonify({'status':'error','message':'no json'}), 400

    # require explicit consent flag
    if not data.get('consent_given'):
        return jsonify({'status':'error','message':'consent required'}), 400

    row = {
        'received_at': datetime.utcnow().isoformat(),
        'latitude': data.get('latitude'),
        'longitude': data.get('longitude'),
        'accuracy': data.get('accuracy'),
        'timestamp': data.get('timestamp'),
        'consent_given': data.get('consent_given'),
        'note': data.get('note','')
    }
    with open(CSV_FILE,'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writerow(row)

    return jsonify({'status':'ok'})

if __name__ == '__main__':
    app.run()
    