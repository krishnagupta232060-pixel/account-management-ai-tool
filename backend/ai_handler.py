import os
import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

def call_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    response = requests.post(url, json=payload)
    result = response.json()
    
    if "error" in result:
        return f"Gemini Error: {result['error']['message']}"
    
    if "candidates" not in result:
        return f"Unexpected response: {str(result)}"
    
    return result["candidates"][0]["content"]["parts"][0]["text"]

def analyze_account(data):
    prompt = f"""You are an expert account manager. Analyze this and provide insights:

Data: {data}

Provide analysis on:
1. Revenue Protection strategies
2. Gross Margin optimization
3. Customer Experience improvements
4. Process Optimization recommendations
5. Risk alerts

Format with clear sections and bullet points."""
    return call_gemini(prompt)

def get_recommendations(account_id, issue_type):
    prompt = f"""As an account management AI, provide recommendations for:
Account ID: {account_id}
Issue Type: {issue_type}

Give 3-5 specific actionable recommendations."""
    return call_gemini(prompt)