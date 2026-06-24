from services.extraction_service import extract_structured_data
from test_data.sample_transcripts import SAMPLES

for i, transcript in enumerate(SAMPLES):
    print(f"\n===== TEST {i+1} =====")

    try:
        result = extract_structured_data(transcript)

        print("✅ VALID")

    except Exception as e:
        print("❌ INVALID")
        print(e)