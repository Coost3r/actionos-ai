from fastapi import FastAPI, UploadFile, File
import shutil
import os

app = FastAPI()

os.makedirs("uploads", exist_ok=True)

@app.get("/")
def root():
    return {"message": "ActionOS Backend Running"}

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "success": True,
        "filename": file.filename
    }