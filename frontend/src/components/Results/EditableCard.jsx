import "./EditableCard.css";

export default function EditableCard({
  title,
  children,
  onEdit,
  onConfirm,
  onDelete,
}) {
  return (
    <div className="editable-card">

      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-body">
        {children}
      </div>

      <div className="card-actions">

        <button
          className="edit-btn"
          onClick={onEdit}
        >
          ✏ Edit
        </button>

        <button
          className="confirm-btn"
          onClick={onConfirm}
        >
          ✔ Confirm
        </button>

        <button
          className="delete-btn"
          onClick={onDelete}
        >
          🗑 Delete
        </button>

      </div>

    </div>
  );
}