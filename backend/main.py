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

    print("\n==============================")
    print("NEW AUDIO UPLOAD")
    print("==============================")

    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    # Save locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    audio_url = None

    # -----------------------------
    # Upload to Supabase Storage
    # -----------------------------
    try:
        print("Uploading audio to Supabase Storage...")

        with open(file_path, "rb") as audio_file:
            storage_response = supabase.storage.from_("audio-files").upload(
                path=unique_name,
                file=audio_file,
                file_options={
                    "content-type": file.content_type
                }
            )

        print("Storage Response:")
        print(storage_response)

        audio_url = (
            supabase.storage
            .from_("audio-files")
            .get_public_url(unique_name)
        )

        print("Audio uploaded successfully!")
        print(audio_url)

    except Exception as e:
        print("\n========== STORAGE ERROR ==========")
        import traceback
        traceback.print_exc()
        audio_url = None

    # -----------------------------
    # Whisper
    # -----------------------------
    print("\nRunning Whisper...")

    segments, info = whisper_model.transcribe(file_path)

    transcript = " ".join(
        segment.text for segment in segments
    ).strip()

    print("Whisper complete!")

    # -----------------------------
    # AI Extraction
    # -----------------------------
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

    # -----------------------------
    # Save to Supabase
    # -----------------------------
    print("\n========== SAVING SESSION ==========")

    try:

        payload = {

    "session_id": session_id,
    "meeting_name": "Untitled Meeting",
    "audio_url": audio_url,
    "transcript": transcript,

    "summary": structured_data.get("summary", []),

    "tasks": structured_data.get("tasks", []),

    "reminders": structured_data.get("reminders", []),

    "action_plan": structured_data.get("action_plans", []),

    "decisions": structured_data.get("decisions", []),

    "risks": structured_data.get("risks", []),

    "archived": False,
    "deleted": False

}

        print("Payload:")
        print(payload)

        response = (
            supabase
            .table("sessions")
            .insert(payload)
            .execute()
        )

        print("\nINSERT RESPONSE:")
        print(response)

        print("\nINSERT DATA:")
        print(response.data)

        # Verify immediately
        verify = (
            supabase
            .table("sessions")
            .select("*")
            .eq("session_id", session_id)
            .execute()
        )

        print("\nVERIFY QUERY:")
        print(verify.data)

        print("Session saved successfully!")

    except Exception as e:

        print("\n========== DATABASE ERROR ==========")
        import traceback
        traceback.print_exc()

    # -----------------------------
    # Cleanup
    # -----------------------------
    try:
        os.remove(file_path)
        print("Temporary file deleted.")
    except Exception as e:
        print(e)

    # -----------------------------
    # Debug
    # -----------------------------
    print("\n========== TRANSCRIPT ==========")
    print(transcript)

    print("\n========== EXTRACTION ==========")
    print(structured_data)

    print("\n===============================")

    # -----------------------------
    # Return
    # -----------------------------
    return {

        "success": True,
        "session_id": session_id,
        "filename": unique_name,
        "audio_url": audio_url,
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

@app.get("/session/{session_id}")
async def get_session(session_id: str):

    print("\n======================")
    print("SESSION REQUEST")
    print("======================")

    print("Requested Session ID:")
    print(session_id)

    response = (
        supabase
        .table("sessions")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )

    print("Rows Found:")
    print(len(response.data))

    print(response.data)

    if len(response.data) == 0:
        return {
            "success": False,
            "error": "Session not found"
        }

    return response.data[0]