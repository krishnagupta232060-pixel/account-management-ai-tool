import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def analyze_account(data):
    prompt = f"""You are an expert account manager. Analyze this account data and provide insights:

Account Data: {data}

Provide analysis on:
1. Revenue Protection strategies
2. Gross Margin optimization
3. Customer Experience improvements
4. Process Optimization recommendations
5. Risk alerts

Be concise and actionable."""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

def get_recommendations(account_id, issue_type):
    prompt = f"""As an account management AI, provide specific recommendations for:
Account ID: {account_id}
Issue Type: {issue_type}

Give 3-5 specific, actionable recommendations."""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text