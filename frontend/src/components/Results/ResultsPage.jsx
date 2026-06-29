import "./ResultsPage.css";

import SummarySection from "./SummarySection";
import TaskSection from "./TaskSection";
import ReminderSection from "./ReminderSection";
import ActionPlanSection from "./ActionPlanSection";
import DecisionSection from "./DecisionSection";
import RiskSection from "./RiskSection";

export default function ResultsPage({ data }) {
  if (!data) {
    return <p>No results yet.</p>;
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
        Structured Output
      </h2>

      <SummarySection summary={data.summary} />

      <TaskSection tasks={data.tasks} />

      <ReminderSection reminders={data.reminders} />

      <ActionPlanSection actionPlans={data.action_plans} />

      <DecisionSection decisions={data.decisions} />

      <RiskSection risks={data.risks} />
    </div>
  );
}