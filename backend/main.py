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

    audio_url = (
        supabase.storage
        .from_("audio-files")
        .get_public_url(unique_name)
    )
    # Transcribe
    segments, info = whisper_model.transcribe(file_path)

    

    transcript = " ".join(segment.text for segment in segments).strip()

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
        structured_data = extract_structured_data(transcript)

    session_id = str(uuid.uuid4())

    supabase.table("sessions").insert({
        "session_id": session_id,
        "audio_url": audio_url,
        "transcript": transcript,
        "tasks": structured_data.get("tasks", []),
        "reminders": structured_data.get("reminders", []),
        "action_plan": structured_data.get("action_plans", []),
        "summary": (
            structured_data.get("summary", "")
            if isinstance(structured_data.get("summary"), str)
            else " ".join(structured_data.get("summary", []))
        )
    }).execute()

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