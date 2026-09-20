import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../store/sessionStore";
import { analyzeChangeImpact } from "../services/changeImpactService";
import type { ChangeType, ScopeChange } from "../types";


export default function ChangeImpactWorkspace() {
  const navigate = useNavigate();

  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);

  const addScopeChange = useSessionStore(
    (state) => state.addScopeChange
  );

  const saveChangeImpact = useSessionStore(
    (state) => state.saveChangeImpact
  );

  const [changeType, setChangeType] =
    useState<ChangeType>("Requirement");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [relatedRequirementIds, setRelatedRequirementIds] =
    useState("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const markOutputOutdated = useSessionStore(
  (state) => state.markOutputOutdated
);

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

  const handleAnalyze = () => {
    if (!title.trim() || !description.trim()) {
      alert("Please provide a title and description.");
      return;
    }

    const change: ScopeChange = {
      id: crypto.randomUUID(),
      changeType,
      title,
      description,
      relatedRequirementIds: relatedRequirementIds
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis = analyzeChangeImpact(session, change);

      addScopeChange(session.id, change);
      saveChangeImpact(session.id, analysis);

      setIsAnalyzing(false);
    }, 500);
  };

  const impactAnalysis = session.lastChangeImpact;

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

          <h1>Change Impact Analysis</h1>

          <p className="page-description">
            Assess how requirement, assumption, and configuration changes
            may affect the scoping package.
          </p>
        </div>
      </div>

      <div className="workspace-banner">
        <div>
          <strong>{session.name}</strong>
          <span>{session.customerName}</span>
        </div>

        <span className="status-badge">
          {impactAnalysis ? "Analysis Available" : "No Changes Analyzed"}
        </span>
      </div>

      <section className="content-section">
        <h2>Record a Change</h2>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="change-type">Change type</label>

            <select
              id="change-type"
              value={changeType}
              onChange={(event) =>
                setChangeType(event.target.value as ChangeType)
              }
            >
              <option value="Requirement">Requirement</option>
              <option value="Assumption">Assumption</option>
              <option value="Cloud Configuration">
                Cloud Configuration
              </option>
              <option value="Scope Configuration">
                Scope Configuration
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="change-title">Change title</label>

            <input
              id="change-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Delivery deadline reduced"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="change-description">
            Describe the change
          </label>

          <textarea
            id="change-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Explain what changed and why..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="related-requirements">
            Related requirement IDs
          </label>

          <input
            id="related-requirements"
            value={relatedRequirementIds}
            onChange={(event) =>
              setRelatedRequirementIds(event.target.value)
            }
            placeholder="Example: FR_01, NFR_02"
          />

          <small>
            Enter comma-separated requirement IDs, if applicable.
          </small>
        </div>

        <button
          className="primary-button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          <RefreshCw size={16} />
          {isAnalyzing ? "Analyzing..." : "Analyze Change Impact"}
        </button>
      </section>

      {impactAnalysis && (
        <>
          <section className="content-section">
            <h2>Latest Change</h2>

            <div className="scope-card">
              <span className="tag">
                {impactAnalysis.change.changeType}
              </span>

              <h3>{impactAnalysis.change.title}</h3>

              <p>{impactAnalysis.change.description}</p>

              <small>
                Related requirements:{" "}
                {impactAnalysis.change.relatedRequirementIds.length > 0
                  ? impactAnalysis.change.relatedRequirementIds.join(", ")
                  : "None specified"}
              </small>
            </div>
          </section>

          <section className="content-section">
            <h2>Impact Assessment</h2>

            <div className="change-impact-list">
              {impactAnalysis.impacts.map((impact) => (
                <article
                  className={`change-impact-card impact-${impact.impactLevel.toLowerCase()}`}
                  key={impact.id}
                >
                  <div className="change-impact-icon">
                    {impact.impactLevel === "None" ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <AlertTriangle size={22} />
                    )}
                  </div>

                  <div className="change-impact-content">
                    <div className="scope-card-header">
                      <h3>{impact.outputArea}</h3>

                      <span className="tag">
                        {impact.impactLevel} Impact
                      </span>
                    </div>

                    <p>{impact.reason}</p>

                    <p>
                      <strong>Recommended action:</strong>{" "}
                      {impact.recommendedAction}
                    </p>

                    <p>
                      <strong>Regeneration required:</strong>{" "}
                      {impact.requiresRegeneration ? "Yes" : "No"}
                    </p>

                    {impact.affectedIds.length > 0 && (
                      <small>
                        Affected IDs: {impact.affectedIds.join(", ")}
                      </small>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>

      )}

      {session.changeHistory && session.changeHistory.length > 0 && (
        <section className="content-section">
          <h2>Change History</h2>

          {session.changeHistory.map((change) => (
            <div className="scope-card" key={change.id}>
              <span className="tag">{change.changeType}</span>
              <h3>{change.title}</h3>
              <p>{change.description}</p>
              <small>
                {new Date(change.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}