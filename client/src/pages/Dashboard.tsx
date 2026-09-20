import { Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <section className="page-heading">
        <div>
          <span className="eyebrow">OVERVIEW</span>

          <h1>Good to see you, Reviewer.</h1>

          <p>
            Turn customer requirements into structured, reviewable solution
            plans.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/sessions/new")}
        >
          <Plus size={18} />
          New Scoping Session
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Total Sessions"
          value={0}
          description="Scoping projects"
        />

        <StatCard label="Drafts" value={0} description="Awaiting review" />

        <StatCard label="Completed" value={0} description="Scoping packages" />
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <h2>Recent Scoping Sessions</h2>
            <p>Your latest solution-scoping activities.</p>
          </div>

          <button className="text-button">
            View all <ArrowRight size={16} />
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">S</div>

          <h3>No scoping sessions yet</h3>

          <p>
            Create your first session to begin analyzing customer requirements.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/sessions/new")}
          >
            <Plus size={18} />
            Create First Session
          </button>
        </div>
      </section>
    </div>
  );
}
