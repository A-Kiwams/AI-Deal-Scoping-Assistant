import { Bell, UserCircle } from "lucide-react";

export default function Topbar() {
  return (
    <header className="topbar">
      <div>
        <span className="topbar-label">SOLUTION CONSULTING WORKSPACE</span>
        <h2>ScopeAI</h2>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>

        <div className="reviewer">
          <UserCircle size={28} />
          <span>Reviewer</span>
        </div>
      </div>
    </header>
  );
}