import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client
groq_client = None
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)

# Model configurations — Groq-hosted models
MODELS = {
    "llama": "llama-3.3-70b-versatile",
    "mixtral": "mixtral-8x7b-32768",
    "gemma": "gemma2-9b-it",
}

DEFAULT_MODEL = "llama"


def call_ai(prompt, model_name=None):
    """Call Groq API for fast AI inference."""
    if not groq_client:
        return "Error: GROQ_API_KEY is not set. Please configure your API key."

    model_id = MODELS.get(model_name or DEFAULT_MODEL, MODELS[DEFAULT_MODEL])

    try:
        response = groq_client.chat.completions.create(
            model=model_id,
            messages=[
                {
                    "role": "system",
                    "content": "You are AMAT AI, an enterprise account management intelligence assistant. You provide professional, concise, and actionable insights. Use clear formatting with sections and bullet points."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=2048,
        )

        if response and response.choices:
            return response.choices[0].message.content
        else:
            return "No response generated. Please try rephrasing your query."

    except Exception as e:
        error_msg = str(e)
        if "rate_limit" in error_msg.lower() or "429" in error_msg:
            return "Rate limit reached. Please wait a moment and try again."
        elif "invalid" in error_msg.lower() and "key" in error_msg.lower():
            return "Invalid API key. Please check your GROQ_API_KEY configuration."
        else:
            return f"AI Error: {error_msg}"


def analyze_account(data, model_name=None):
    prompt = f"""Analyze this account data and provide insights:

Data: {data}

Provide analysis on:
1. Revenue Protection strategies
2. Gross Margin optimization
3. Customer Experience improvements
4. Process Optimization recommendations
5. Risk alerts

Format with clear sections and bullet points."""
    return call_ai(prompt, model_name)


def get_recommendations(account_id, issue_type, model_name=None):
    prompt = f"""Provide recommendations for:
Account ID: {account_id}
Issue Type: {issue_type}

Give 3-5 specific actionable recommendations."""
    return call_ai(prompt, model_name)


def chat_response(message, model_name=None):
    """General chat endpoint for the floating chatbox."""
    prompt = f"""Help with the following account management query. Be concise, professional, and actionable.

User message: {message}"""
    return call_ai(prompt, model_name)