import "./ResultsPage.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import SummarySection from "../components/results/SummarySection";
import TaskSection from "../components/results/TaskSection";
import ReminderSection from "../components/results/ReminderSection";
import ActionPlanSection from "../components/results/ActionPlanSection";
import DecisionSection from "../components/results/DecisionSection";
import RiskSection from "../components/results/RiskSection";

export default function ResultsPage() {

  const { sessionId } = useParams();

  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadMeeting() {

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/session/${sessionId}`
        );

        const data = await response.json();

        console.log("Meeting Loaded:", data);

        setMeeting(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    }

    loadMeeting();

  }, [sessionId]);

  if (loading) {
    return <p>Loading meeting...</p>;
  }

  if (!meeting) {
    return <p>Meeting not found.</p>;
  }

  return (

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

      <h2 className="section-title">
        {meeting.meeting_name}
      </h2>

      <SummarySection
        summary={meeting.summary}
      />

      <TaskSection
        tasks={meeting.tasks}
      />

      <ReminderSection
        reminders={meeting.reminders}
      />

      <ActionPlanSection
        actionPlans={meeting.action_plan}
      />

      <DecisionSection
        decisions={meeting.decisions || []}
      />

      <RiskSection
        risks={meeting.risks || []}
      />

    </div>

  );

}