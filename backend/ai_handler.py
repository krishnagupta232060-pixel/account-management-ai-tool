import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Gemini client
gemini_client = None
if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# Model configurations — Google Gemini models
MODELS = {
    "llama": "gemini-2.0-flash",       # mapped from old "llama" key for frontend compatibility
    "mixtral": "gemini-1.5-flash",     # mapped from old "mixtral" key for frontend compatibility
    "gemma": "gemini-2.0-flash",       # fallback
}

DEFAULT_MODEL = "llama"

SYSTEM_PROMPT = "You are AMAT AI, an enterprise account management intelligence assistant. You provide professional, concise, and actionable insights. Use clear formatting with sections and bullet points."


def call_ai(prompt, model_name=None):
    """Call Google Gemini API for AI inference."""
    if not gemini_client:
        return "Error: GEMINI_API_KEY is not set. Please configure your API key."

    model_id = MODELS.get(model_name or DEFAULT_MODEL, MODELS[DEFAULT_MODEL])

    try:
        response = gemini_client.models.generate_content(
            model=model_id,
            contents=prompt,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )

        if response and response.text:
            return response.text
        else:
            return "No response generated. Please try rephrasing your query."

    except Exception as e:
        error_msg = str(e)
        if "rate" in error_msg.lower() or "429" in error_msg:
            return "Rate limit reached. Please wait a moment and try again."
        elif "invalid" in error_msg.lower() and "key" in error_msg.lower():
            return "Invalid API key. Please check your GEMINI_API_KEY configuration."
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