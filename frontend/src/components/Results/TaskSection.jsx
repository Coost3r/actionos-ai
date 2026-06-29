import EditableCard from "./EditableCard";
import "./Section.css";

export default function TaskSection({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <section className="result-section">
        <h2>Tasks</h2>
        <p>No tasks found.</p>
      </section>
    );
  }

  return (
    <section className="result-section">
      <h2 className="section-title">Tasks</h2>

      {tasks.map((task, index) => (
        <EditableCard
          key={index}
          title={task.task}
          onEdit={() => console.log("Edit", index)}
          onConfirm={() => console.log("Confirm", index)}
          onDelete={() => console.log("Delete", index)}
        >
          <p><strong>Owner:</strong> {task.owner || "Unassigned"}</p>

          <p><strong>Due:</strong> {task.due_date || "Not specified"}</p>

          <p>
            <strong>Priority:</strong>{" "}
            <span className={`priority ${task.priority?.toLowerCase()}`}>
              {task.priority?.toUpperCase() || "NONE"}
            </span>
          </p>
        </EditableCard>
      ))}
    </section>
  );
}