from flask import Blueprint, jsonify, request
from data_processor import process_account_data, calculate_metrics

account_bp = Blueprint('accounts', __name__)

accounts_db = []

@account_bp.route('/', methods=['GET'])
def get_accounts():
    return jsonify({"accounts": accounts_db, "metrics": calculate_metrics(accounts_db)})

@account_bp.route('/', methods=['POST'])
def add_account():
    raw_data = request.get_json()
    processed = process_account_data(raw_data)
    accounts_db.append(processed)
    return jsonify({"message": "Account added", "account": processed}), 201

@account_bp.route('/<account_id>', methods=['GET'])
def get_account(account_id):
    account = next((a for a in accounts_db if a["account_id"] == account_id), None)
    if not account:
        return jsonify({"error": "Account not found"}), 404
    return jsonify(account)

@account_bp.route('/<account_id>', methods=['DELETE'])
def delete_account(account_id):
    global accounts_db
    accounts_db = [a for a in accounts_db if a["account_id"] != account_id]
    return jsonify({"message": "Account deleted"})