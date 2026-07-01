import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaveSurfer from "wavesurfer.js";
import "./VoiceRecorder.css";

function VoiceRecorder() {
  const navigate = useNavigate();

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [seconds, setSeconds] = useState(0);

  const [uploadStatus, setUploadStatus] = useState("");
  const [transcript, setTranscript] = useState("");
  const [extraction, setExtraction] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  // =====================================
  // Reusable Upload Function
  // =====================================
  const uploadAudio = async (audioFile, filename) => {
    sessionStorage.removeItem("actionos_results");

    const formData = new FormData();

    formData.append("file", audioFile, filename);

    try {
      setUploadStatus("Uploading audio...");

      const response = await fetch(
        "http://127.0.0.1:8000/upload-audio",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
     
      
      console.log("Backend Response:", data);
sessionStorage.setItem(
  "current_session",
  data.session_id
);
      if (!response.ok) {
        throw new Error(data.detail || "Upload failed.");
      }

      setTranscript(data.transcript || "");
      setExtraction(data.extraction || null);
      sessionStorage.setItem(
  "actionos_results",
  JSON.stringify({
    transcript: data.transcript,
    extraction: data.extraction,
    audioUrl: data.audio_url,
  })
);

      setUploadStatus(
        "✅ Upload & extraction completed successfully."
      );

      // Automatically open Results page
      sessionStorage.setItem(
  "current_session",
  data.session_id
);

navigate(`/results/${data.session_id}`);

    } catch (error) {
      console.error(error);

      setUploadStatus(
        `❌ Upload failed: ${error.message}`
      );
    }
  };

  // =====================================
  // Recording
  // =====================================
  const startRecording = async () => {
    sessionStorage.removeItem("actionos_results");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {

        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const url =
          URL.createObjectURL(audioBlob);

        setAudioURL(url);

        await uploadAudio(
          audioBlob,
          `recording-${Date.now()}.webm`
        );
      };

      mediaRecorder.start();

      setRecording(true);
      setSeconds(0);

      setUploadStatus("");
      setTranscript("");
      setExtraction(null);

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

  // =====================================
  // Waveform
  // =====================================

  useEffect(() => {

    if (!audioURL || !waveformRef.current)
      return;

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    wavesurferRef.current =
      WaveSurfer.create({

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
          VOICE POWERED PRODUCTIVITY
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
            🎤 Record
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
          {recording ? "🔴 Recording..." : "⚪ Ready"}
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
            <h3 className="section-title">
              Transcript
            </h3>

            <p>{transcript}</p>
          </div>
        )}

        {/* Results after upload/recording */}

        {extraction && (
          <div className="post-upload-actions">

            <p className="success-message">
              ✅ Upload & Extraction Complete
            </p>

            <div className="action-buttons">

              <button
                className="record-btn start"
                onClick={() => navigate(`/results/${sessionStorage.getItem("current_session")}`)
}
              >
                📋 View Results
              </button>

              <button
                className="record-btn stop"
                onClick={startRecording}
              >
                🎤 Record Again
              </button>

            </div>

          </div>
        )}

        {/* Upload Section */}

        <div className="upload">

          <input
            type="file"
            accept="audio/*"

            onChange={async (e) => {

              const file = e.target.files[0];

              if (!file) return;

              setAudioURL(
                URL.createObjectURL(file)
              );

              setTranscript("");

              setExtraction(null);

              await uploadAudio(
                file,
                file.name
              );

            }}
          />

        </div>

        {/* Waveform */}

        {audioURL && (
          <>

            <div
              ref={waveformRef}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            />

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