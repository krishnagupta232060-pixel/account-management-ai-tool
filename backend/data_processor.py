def process_account_data(raw_data):
    processed = {
        "account_id": raw_data.get("account_id", "N/A"),
        "company_name": raw_data.get("company_name", "Unknown"),
        "revenue": float(raw_data.get("revenue", 0)),
        "gross_margin": float(raw_data.get("gross_margin", 0)),
        "customer_score": float(raw_data.get("customer_score", 0)),
        "risk_level": calculate_risk(raw_data),
        "status": raw_data.get("status", "active")
    }
    return processed

def calculate_risk(data):
    revenue = float(data.get("revenue", 0))
    margin = float(data.get("gross_margin", 0))
    score = float(data.get("customer_score", 0))

    if margin < 10 or score < 5:
        return "high"
    elif margin < 20 or score < 7:
        return "medium"
    else:
        return "low"

def format_currency(amount):
    return "${:,.2f}".format(amount)

def calculate_metrics(accounts):
    if not accounts:
        return {}
    
    total_revenue = sum(a.get("revenue", 0) for a in accounts)
    avg_margin = sum(a.get("gross_margin", 0) for a in accounts) / len(accounts)
    avg_score = sum(a.get("customer_score", 0) for a in accounts) / len(accounts)
    
    return {
        "total_revenue": format_currency(total_revenue),
        "average_margin": round(avg_margin, 2),
        "average_customer_score": round(avg_score, 2),
        "total_accounts": len(accounts)
    }