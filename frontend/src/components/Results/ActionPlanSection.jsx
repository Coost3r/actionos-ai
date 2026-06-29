import EditableCard from "./EditableCard";
import "./Section.css";

export default function ActionPlanSection({ actionPlans }) {
  return (
    <section className="result-section">
      <h2 className="section-title">Action Plans</h2>

      {!actionPlans || actionPlans.length === 0 ? (
        <p>No action plans found.</p>
      ) : (
        actionPlans.map((plan, index) => (
          <EditableCard
            key={index}
            title={plan.goal}
            onEdit={() => console.log("Edit Plan", index)}
            onConfirm={() => console.log("Confirm Plan", index)}
            onDelete={() => console.log("Delete Plan", index)}
          >
            <strong>Steps:</strong>

            <ul>
              {(plan.steps || []).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </EditableCard>
        ))
      )}
    </section>
  );
}