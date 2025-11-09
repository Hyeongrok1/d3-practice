# explain.py
from flask import Blueprint, Response, jsonify, make_response, request

explain_bp = Blueprint('explain', __name__)

@explain_bp.route('/api/get-feature-explains', methods=['POST', 'OPTIONS'])
def get_feature_explain():
    if request.method == 'POST':
        print(request.json)
        response = jsonify({"message": "Data received successfully!", "received_data": request.json})
        response.headers['Access-Control-Allow-Origin'] = '*' # Or 'http://localhost:3000'
        return response
    elif request.method == 'OPTIONS':
        response = make_response('', 204)
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000' 
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response