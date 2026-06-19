from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase
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


@app.get("/")
def root():
    return {"message": "ActionOS Backend Running"}


@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    # Generate unique filename
    unique_name = f"{uuid.uuid4()}_{file.filename}"

    # Local storage path
    file_path = os.path.join(
        UPLOAD_DIR,
        unique_name
    )

    # Save locally
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Upload to Supabase
    with open(file_path, "rb") as audio_file:
        supabase.storage.from_("audio-files").upload(
            path=unique_name,
            file=audio_file,
            file_options={
                "content-type": file.content_type
            }
        )

    return {
        "success": True,
        "filename": unique_name,
        "local_path": file_path
    }