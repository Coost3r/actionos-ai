from openai import OpenAI
from prompts.extraction_prompt import SYSTEM_PROMPT
from test_data.sample_transcripts import SAMPLES

client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)

for i, transcript in enumerate(SAMPLES):
    print(f"\n===== TEST {i+1} =====")

    response = client.chat.completions.create(
        model="qwen3:8b",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": transcript}
        ],
        temperature=0
    )

    print(response.choices[0].message.content)