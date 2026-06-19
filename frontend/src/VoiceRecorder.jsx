import { useState, useRef } from "react";
import "./VoiceRecorder.css";

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const formData = new FormData();

        formData.append(
          "file",
          audioBlob,
          `recording-${Date.now()}.webm`
        );

        try {
          setUploadStatus("Uploading...");

          const response = await fetch(
            "http://127.0.0.1:8000/upload-audio",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          setUploadStatus(
            `✅ Uploaded: ${data.filename}`
          );

          console.log("Upload successful:", data);
        } catch (error) {
          console.error(error);
          setUploadStatus("❌ Upload failed");
        }
      };

      mediaRecorder.start();

      setSeconds(0);
      setRecording(true);
      setUploadStatus("");

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();

    clearInterval(timerRef.current);

    setRecording(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">ActionOS</h1>

        <p className="subtitle">
          Voice Powered Productivity
        </p>

        <div className="timer">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}
          :
          {String(seconds % 60).padStart(2, "0")}
        </div>

        {!recording ? (
          <button
            className="record-btn start"
            onClick={startRecording}
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            className="record-btn stop"
            onClick={stopRecording}
          >
            ⏹ Stop Recording
          </button>
        )}

        <p>
          {recording
            ? "🔴 Recording..."
            : "⚪ Ready"}
        </p>

        <p>{uploadStatus}</p>

        <div className="upload">
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setAudioURL(
                  URL.createObjectURL(file)
                );
              }
            }}
          />
        </div>

        <br />

        {audioURL && (
          <audio
            controls
            src={audioURL}
            style={{ width: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

export default VoiceRecorder;