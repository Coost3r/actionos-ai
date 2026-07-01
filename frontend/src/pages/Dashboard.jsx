import DashboardHeader from "../components/dashboard/DashboardHeader";
import TodaysActions from "../components/dashboard/TodaysActions";
import UpcomingReminders from "../components/dashboard/UpcomingReminders";
import OpenTasks from "../components/dashboard/OpenTasks";
import CompletedTasks from "../components/dashboard/CompletedTasks";
import ActionPlans from "../components/dashboard/ActionPlans";
import RecentSessions from "../components/dashboard/RecentSessions";

import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <TodaysActions />
      <UpcomingReminders />

      <OpenTasks />
      <CompletedTasks />

      <ActionPlans />

      <RecentSessions />
    </div>
  );
}