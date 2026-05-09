import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_account(data):
    prompt = f"""You are an expert account manager. Analyze this account data and provide insights:

Account Data: {data}

Provide analysis on:
1. Revenue Protection strategies
2. Gross Margin optimization
3. Customer Experience improvements
4. Process Optimization recommendations
5. Risk alerts

Be concise and actionable. Format your response with clear sections and bullet points."""

    response = model.generate_content(prompt)
    return response.text

def get_recommendations(account_id, issue_type):
    prompt = f"""As an account management AI, provide specific recommendations for:
Account ID: {account_id}
Issue Type: {issue_type}

Give 3-5 specific, actionable recommendations with clear formatting."""

    response = model.generate_content(prompt)
    return response.text