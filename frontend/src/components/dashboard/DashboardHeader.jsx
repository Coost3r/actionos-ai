export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="dashboard-header">
      <div>
        <h1 className="dashboard-title">ACTIONOS</h1>
        <p className="dashboard-subtitle">
          Welcome back. Here's your action center.
        </p>
      </div>

      <div className="dashboard-date">
        {today}
      </div>
    </header>
  );
}