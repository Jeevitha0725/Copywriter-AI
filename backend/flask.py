from flask import Flask, jsonify
import cw_landingpage  # Import the response.py file

app = Flask(__name__)

@app.route('/get-response', methods=['GET'])
def get_response():
    return jsonify(cw_landingpage.parsed_json)

if __name__ == '__main__':
    app.run(debug=True)