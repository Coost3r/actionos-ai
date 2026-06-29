import EditableCard from "./EditableCard";
import "./Section.css";

export default function ReminderSection({ reminders }) {
  return (
    <section className="result-section">
      <h2 className="section-title">Reminders</h2>

      {!reminders || reminders.length === 0 ? (
        <p>No reminders found.</p>
      ) : (
        reminders.map((reminder, index) => (
          <EditableCard
            key={index}
            title={reminder.title}
            onEdit={() => console.log("Edit Reminder", index)}
            onConfirm={() => console.log("Confirm Reminder", index)}
            onDelete={() => console.log("Delete Reminder", index)}
          >
            <p>
              <strong>Time:</strong>{" "}
              {reminder.date_or_time || "Not specified"}
            </p>

            <p>
              <strong>Owner:</strong>{" "}
              {reminder.owner || "Not assigned"}
            </p>
          </EditableCard>
        ))
      )}
    </section>
  );
}