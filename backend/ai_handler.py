import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")

# Initialize Hugging Face Inference client
hf_client = None
if HF_API_TOKEN:
    hf_client = InferenceClient(api_key=HF_API_TOKEN)

# Model configurations — Hugging Face hosted models (free inference)
MODELS = {
    "llama": "Qwen/Qwen2.5-7B-Instruct",
    "mixtral": "HuggingFaceH4/zephyr-7b-beta",
}

DEFAULT_MODEL = "llama"

SYSTEM_PROMPT = "You are AMAT AI, an enterprise account management intelligence assistant. You provide professional, concise, and actionable insights. Use clear formatting with sections and bullet points."


def call_ai(prompt, model_name=None):
    """Call Hugging Face Inference API for AI inference."""
    if not hf_client:
        return "Error: HF_API_TOKEN is not set. Please configure your Hugging Face API token."

    model_id = MODELS.get(model_name or DEFAULT_MODEL, MODELS[DEFAULT_MODEL])

    try:
        response = hf_client.chat.completions.create(
            model=model_id,
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": prompt,
                },
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
        if "rate" in error_msg.lower() or "429" in error_msg:
            return "Rate limit reached. Please wait a moment and try again."
        elif "unauthorized" in error_msg.lower() or "401" in error_msg:
            return "Invalid API token. Please check your HF_API_TOKEN configuration."
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