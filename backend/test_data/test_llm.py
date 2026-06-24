from llm_service import extract_from_llm

transcript = """
Ravi will send the IBM proposal by Friday.
Priya will schedule the demo next week.
"""

result = extract_from_llm(transcript)

print(result)