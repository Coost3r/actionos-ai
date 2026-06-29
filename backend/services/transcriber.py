import whisper

# Load the model once when the module is imported
model = whisper.load_model("base")


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes an audio file and returns the transcript.
    """
    result = model.transcribe(audio_path)
    return result["text"].strip()