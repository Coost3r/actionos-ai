import { useState, useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import "./VoiceRecorder.css";

function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

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

          console.log("Response status:", response.status);
          console.log("Response OK:", response.ok);

          const data = await response.json();

          console.log("Response data:", data);

          setUploadStatus(
            `✅ Uploaded: ${data.filename}`
          );

          if (data.transcript) {
            setTranscript(data.transcript);
          }

        } catch (error) {
          console.error("Upload error:", error);

          setUploadStatus(
            `❌ Upload failed: ${error.message}`
          );
        }
      };

      mediaRecorder.start();

      setSeconds(0);
      setRecording(true);
      setUploadStatus("");
      setTranscript("");

      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error(error);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    clearInterval(timerRef.current);

    setRecording(false);
  };

  useEffect(() => {
    if (!audioURL || !waveformRef.current) return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#7c3aed",
      progressColor: "#22c55e",
      cursorColor: "#ffffff",
      height: 100,
    });

    wavesurferRef.current.load(audioURL);

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioURL]);

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

        {transcript && (
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #444",
              borderRadius: "8px",
              textAlign: "left",
              width: "100%",
            }}
          >
            <h3>Transcript</h3>
            <p>{transcript}</p>
          </div>
        )}

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
          <>
            <div
              ref={waveformRef}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            />

            <br />

            <button
              className="record-btn start"
              onClick={() =>
                wavesurferRef.current?.playPause()
              }
            >
              ▶ Play / Pause
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default VoiceRecorder;