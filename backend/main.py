from services.extraction_service import extract_structured_data
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
from faster_whisper import WhisperModel
from pydantic import BaseModel
import shutil
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)
print("Loading Whisper model...")
whisper_model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)
print("Whisper model loaded!")

@app.get("/")
def root():
    return {"message": "ActionOS Backend Running"}


@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    unique_name = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_name
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    with open(file_path, "rb") as audio_file:
        supabase.storage.from_("audio-files").upload(
            path=unique_name,
            file=audio_file,
            file_options={
                "content-type": file.content_type
            }
        )

    # Transcribe
    segments, info = whisper_model.transcribe(
        file_path
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    transcript = transcript.strip()

    if not transcript:
        structured_data = {
            "summary": [],
            "tasks": [],
            "reminders": [],
            "action_plans": [],
            "decisions": [],
            "risks": []
        }
    else:
        structured_data = extract_structured_data(
            transcript
        )

    print("\nTRANSCRIPT:")
    print(transcript)

    print("\nEXTRACTION:")
    print(structured_data)

    return {
        "success": True,
        "filename": unique_name,
        "local_path": file_path,
        "transcript": transcript,
        "extraction": structured_data
    }

class ExtractRequest(BaseModel):
    transcript: str


@app.post("/extract")
async def extract_text(request: ExtractRequest):

    if not request.transcript.strip():
        return {
            "summary": [],
            "tasks": [],
            "reminders": [],
            "action_plans": [],
            "decisions": [],
            "risks": []
        }

    return extract_structured_data(
        request.transcript
    )