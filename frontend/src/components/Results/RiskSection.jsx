import EditableCard from "./EditableCard";
import "./Section.css";

export default function RiskSection({ risks }) {
  return (
    <section className="result-section">
      <h2 className="section-title">Risks</h2>

      {!risks || risks.length === 0 ? (
        <p>No risks detected.</p>
      ) : (
        risks.map((risk, index) => (
          <EditableCard
            key={index}
            title={`Risk ${index + 1}`}
            onEdit={() => console.log("Edit Risk", index)}
            onConfirm={() => console.log("Confirm Risk", index)}
            onDelete={() => console.log("Delete Risk", index)}
          >
            <p>{risk}</p>
          </EditableCard>
        ))
      )}
    </section>
  );
}