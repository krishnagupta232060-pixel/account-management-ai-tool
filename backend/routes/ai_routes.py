from flask import Blueprint, jsonify, request
from ai_handler import analyze_account, get_recommendations

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    result = analyze_account(data)
    return jsonify({"analysis": result})

@ai_bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    account_id = data.get("account_id")
    issue_type = data.get("issue_type")
    result = get_recommendations(account_id, issue_type)
    return jsonify({"recommendations": result})