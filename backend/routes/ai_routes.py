from flask import Blueprint, jsonify, request
from ai_handler import analyze_account, get_recommendations, chat_response

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    model = data.get("model", "llama")
    result = analyze_account(data.get("data", data), model)
    return jsonify({"analysis": result})

@ai_bp.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    account_id = data.get("account_id")
    issue_type = data.get("issue_type")
    model = data.get("model", "llama")
    result = get_recommendations(account_id, issue_type, model)
    return jsonify({"recommendations": result})

@ai_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    model = data.get("model", "llama")
    if not message.strip():
        return jsonify({"error": "Message cannot be empty"}), 400
    result = chat_response(message, model)
    return jsonify({"response": result})

@ai_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint to verify AI service is running."""
    from ai_handler import HF_API_TOKEN
    return jsonify({
        "status": "ok",
        "api_key_configured": bool(HF_API_TOKEN),
        "provider": "huggingface",
    })