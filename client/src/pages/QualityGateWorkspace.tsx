import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../store/sessionStore";
import { runQualityGate } from "../services/qualityGateService";

export default function QualityGateWorkspace() {
  const navigate = useNavigate();

  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const saveQualityGate = useSessionStore(
    (state) => state.runQualityGate
  );

  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState("All");

  const session = sessions.find(
    (currentSession) => currentSession.id === activeSessionId
  );

  if (!session) {
    return (
      <div className="page-container">
        <h1>No active session</h1>
        <p>Create or select a session first.</p>

        <button
          className="primary-button"
          onClick={() => navigate("/sessions/new")}
        >
          Create Session
        </button>
      </div>
    );
  }

  if (!session.scopeModel) {
    return (
      <div className="page-container">
        <h1>Requirements analysis required</h1>
        <p>
          Analyze the requirements before running the Quality Gate.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate(`/requirements/${session.id}`)}
        >
          Go to Requirements
        </button>
      </div>
    );
  }

  const qualityGate = session.qualityGate;

  const handleRunQualityGate = () => {
    setIsRunning(true);

    setTimeout(() => {
      const result = runQualityGate({
        scopeModel: session.scopeModel!,
        functionalScope: session.functionalScope,
        architectureModel: session.architectureModel,
        dataAISolution: session.dataAISolution,
        estimationModel: session.estimationModel,
      });

      saveQualityGate(session.id, result);
      setIsRunning(false);
    }, 500);
  };

  const filteredResults =
    qualityGate?.results.filter((result) => {
      if (filter === "All") return true;
      return result.status === filter;
    }) ?? [];

  const getStatusIcon = (status: string) => {
    if (status === "Passed") {
      return <CheckCircle2 size={20} />;
    }

    if (status === "Failed") {
      return <AlertCircle size={20} />;
    }

    return <Info size={20} />;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <h1>Quality Gate</h1>

          <p className="page-description">
            Validate completeness, traceability, consistency, and readiness
            of the generated scoping package.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleRunQualityGate}
          disabled={isRunning}
        >
          <RefreshCw size={16} />
          {isRunning ? "Running Checks..." : "Run Quality Gate"}
        </button>
      </div>

      <div className="workspace-banner">
        <div>
          <strong>{session.name}</strong>
          <span>{session.customerName}</span>
        </div>

        <span className="status-badge">
          {qualityGate ? qualityGate.summary.overallStatus : "Not Run"}
        </span>
      </div>

      {!qualityGate && (
        <div className="empty-state">
          <ShieldCheck size={44} />

          <h2>Ready to validate your scoping package</h2>

          <p>
            Run the Quality Gate to identify missing information and areas
            requiring review.
          </p>
        </div>
      )}

      {qualityGate && (
        <>
          <div className="quality-summary-grid">
            <div className="summary-card">
              <strong>{qualityGate.summary.totalChecks}</strong>
              <span>Total Checks</span>
            </div>

            <div className="summary-card quality-passed">
              <strong>{qualityGate.summary.passedChecks}</strong>
              <span>Passed</span>
            </div>

            <div className="summary-card quality-warning">
              <strong>{qualityGate.summary.warningChecks}</strong>
              <span>Needs Review</span>
            </div>

            <div className="summary-card quality-failed">
              <strong>{qualityGate.summary.failedChecks}</strong>
              <span>Failed</span>
            </div>
          </div>

          <div className="quality-overall-status">
            <ShieldCheck size={24} />

            <div>
              <strong>Overall status</strong>
              <p>{qualityGate.summary.overallStatus}</p>
            </div>
          </div>

          <div className="quality-toolbar">
            <label htmlFor="quality-filter">Filter checks</label>

            <select
              id="quality-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All</option>
              <option value="Passed">Passed</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <section className="quality-results">
            {filteredResults.map((result) => (
              <article
                className={`quality-result quality-${result.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
                key={result.id}
              >
                <div className="quality-result-icon">
                  {getStatusIcon(result.status)}
                </div>

                <div className="quality-result-content">
                  <div className="quality-result-heading">
                    <div>
                      <span className="quality-category">
                        {result.category}
                      </span>

                      <h3>{result.title}</h3>
                    </div>

                    <span className="tag">{result.status}</span>
                  </div>

                  <p>{result.description}</p>

                  <p>
                    <strong>Recommendation:</strong>{" "}
                    {result.recommendation}
                  </p>

                  {result.relatedIds.length > 0 && (
                    <small>
                      Related IDs: {result.relatedIds.join(", ")}
                    </small>
                  )}
                </div>
              </article>
            ))}

            {filteredResults.length === 0 && (
              <div className="empty-state">
                <p>No checks match the selected filter.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}