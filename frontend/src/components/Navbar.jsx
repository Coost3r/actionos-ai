import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("current_session");
    setCurrentSession(sessionId);
  }, [location]);

  const openResults = () => {
    if (!currentSession) return;

    navigate(`/results/${currentSession}`);
  };

  return (
    <nav className="navbar">
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
      >
        ACTIONOS
      </div>

      <div className="nav-links">

        <button
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <button
          className={
            location.pathname.startsWith("/results")
              ? "active"
              : ""
          }
          onClick={openResults}
          disabled={!currentSession}
          style={{
            opacity: currentSession ? 1 : 0.45,
            cursor: currentSession ? "pointer" : "not-allowed",
          }}
          title={
            currentSession
              ? "Open latest meeting"
              : "Record or upload a meeting first"
          }
        >
          Results
        </button>

        <button
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

      </div>
    </nav>
  );
}