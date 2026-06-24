import json

from openai import OpenAI

from prompts.extraction_prompt import SYSTEM_PROMPT
from schemas.extraction import ExtractionResult

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

def extract_structured_data(transcript: str):

    response = client.chat.completions.create(
        model="qwen3:8b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript}
        ],
        temperature=0
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
    except Exception:
        raise ValueError("Model returned invalid JSON")

    validated = ExtractionResult.model_validate(data)

    return validated.model_dump()