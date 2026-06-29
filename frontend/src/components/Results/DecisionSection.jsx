import EditableCard from "./EditableCard";
import "./Section.css";

export default function DecisionSection({ decisions }) {
  return (
    <section className="result-section">
      <h2 className="section-title">Decisions</h2>

      {!decisions || decisions.length === 0 ? (
        <p>No decisions found.</p>
      ) : (
        decisions.map((decision, index) => (
          <EditableCard
            key={index}
            title={`Decision ${index + 1}`}
            onEdit={() => console.log("Edit Decision", index)}
            onConfirm={() => console.log("Confirm Decision", index)}
            onDelete={() => console.log("Delete Decision", index)}
          >
            <p>{decision}</p>
          </EditableCard>
        ))
      )}
    </section>
  );
}