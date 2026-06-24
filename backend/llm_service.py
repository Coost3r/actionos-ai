from openai import OpenAI
from prompts.extraction_prompt import SYSTEM_PROMPT

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

def extract_from_llm(transcript: str):

    response = client.chat.completions.create(
        model="qwen3:8b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript}
        ],
        temperature=0
    )

    return response.choices[0].message.content