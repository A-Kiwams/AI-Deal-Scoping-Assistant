import { useState } from "react";
import { ArrowLeft, BrainCircuit, Database, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../store/sessionStore";
import { generateDataAISolution } from "../services/dataAIService";

export default function DataAIWorkspace() {
  const navigate = useNavigate();

  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const saveDataAISolution = useSessionStore(
    (state) => state.generateDataAISolution
  );

  const [activeTab, setActiveTab] = useState("data");
  const [isGenerating, setIsGenerating] = useState(false);

  const session = sessions.find(
    (currentSession) => currentSession.id === activeSessionId
  );

  if (!session) {
    return (
      <div className="page-container">
        <h1>No active session</h1>
        <p>Create or select a scoping session first.</p>
        <button onClick={() => navigate("/sessions/new")}>
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
          Analyze and review the requirements before creating the Data & AI
          solution model.
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

  const dataAISolution = session.dataAISolution;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generatedModel = generateDataAISolution(session.scopeModel!);

      saveDataAISolution(session.id, generatedModel);
      setIsGenerating(false);
    }, 500);
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

          <h1>Data & AI Solution</h1>
          <p className="page-description">
            Define data structures, data movement, integrations, and AI
            decision points for this opportunity.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <RefreshCw size={16} />
          {isGenerating ? "Generating..." : "Generate Model"}
        </button>
      </div>

      <div className="workspace-banner">
        <div>
          <strong>{session.name}</strong>
          <span>{session.customerName}</span>
        </div>

        <span className="status-badge">
          {dataAISolution ? "Generated" : "Not Generated"}
        </span>
      </div>

      {!dataAISolution && (
        <div className="empty-state">
          <BrainCircuit size={42} />
          <h2>Build the Data & AI solution model</h2>
          <p>
            Generate a mock Data & AI model based on the reviewed requirements.
          </p>
        </div>
      )}

      {dataAISolution && (
        <>
          <div className="data-ai-summary-grid">
            <div className="summary-card">
              <Database size={22} />
              <strong>{dataAISolution.dataEntities.length}</strong>
              <span>Data Entities</span>
            </div>

            <div className="summary-card">
              <strong>{dataAISolution.dataFlows.length}</strong>
              <span>Data Flows</span>
            </div>

            <div className="summary-card">
              <strong>{dataAISolution.integrations.length}</strong>
              <span>Integrations</span>
            </div>

            <div className="summary-card">
              <strong>{dataAISolution.aiDecisionPoints.length}</strong>
              <span>AI Decision Points</span>
            </div>
          </div>

          <div className="tab-navigation">
            <button
              className={activeTab === "data" ? "active" : ""}
              onClick={() => setActiveTab("data")}
            >
              Data
            </button>

            <button
              className={activeTab === "integrations" ? "active" : ""}
              onClick={() => setActiveTab("integrations")}
            >
              Integrations
            </button>

            <button
              className={activeTab === "ai" ? "active" : ""}
              onClick={() => setActiveTab("ai")}
            >
              AI Decisions
            </button>

            <button
              className={activeTab === "responsible-ai" ? "active" : ""}
              onClick={() => setActiveTab("responsible-ai")}
            >
              Responsible AI
            </button>

            <button
              className={activeTab === "evaluation" ? "active" : ""}
              onClick={() => setActiveTab("evaluation")}
            >
              Evaluation
            </button>
          </div>

          {activeTab === "data" && (
            <div className="section-stack">
              <section className="content-section">
                <h2>Data Entities</h2>

                {dataAISolution.dataEntities.map((entity) => (
                  <div className="scope-card" key={entity.id}>
                    <div className="scope-card-header">
                      <h3>{entity.name}</h3>
                      <span className="tag">{entity.classification}</span>
                    </div>

                    <p>{entity.description}</p>
                    <p>
                      <strong>Source:</strong> {entity.source}
                    </p>
                    <p>
                      <strong>Retention:</strong> {entity.retentionNotes}
                    </p>

                    <small>
                      Requirement IDs:{" "}
                      {entity.requirementIds.join(", ")}
                    </small>
                  </div>
                ))}
              </section>

              <section className="content-section">
                <h2>Data Flows</h2>

                {dataAISolution.dataFlows.map((flow) => (
                  <div className="scope-card" key={flow.id}>
                    <h3>{flow.name}</h3>

                    <p>
                      <strong>Source:</strong> {flow.source}
                    </p>

                    <p>
                      <strong>Destination:</strong> {flow.destination}
                    </p>

                    <p>{flow.description}</p>

                    <strong>Data transferred</strong>
                    <ul>
                      {flow.dataTransferred.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <strong>Security considerations</strong>
                    <ul>
                      {flow.securityConsiderations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            </div>
          )}

          {activeTab === "integrations" && (
            <section className="content-section">
              <h2>Integration Considerations</h2>

              {dataAISolution.integrations.map((integration) => (
                <div className="scope-card" key={integration.id}>
                  <div className="scope-card-header">
                    <h3>{integration.systemName}</h3>
                    <span className="tag">{integration.status}</span>
                  </div>

                  <p>{integration.purpose}</p>

                  <p>
                    <strong>Integration method:</strong>{" "}
                    {integration.integrationMethod}
                  </p>

                  <h4>Open questions</h4>
                  <ul>
                    {integration.openQuestions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {activeTab === "ai" && (
            <section className="content-section">
              <h2>AI Decision Points</h2>

              {dataAISolution.aiDecisionPoints.map((decision) => (
                <div className="scope-card" key={decision.id}>
                  <div className="scope-card-header">
                    <h3>{decision.name}</h3>
                    <span className="tag">{decision.processingType}</span>
                  </div>

                  <p>{decision.description}</p>

                  <p>
                    <strong>Proposed technology:</strong>{" "}
                    {decision.proposedTechnology}
                  </p>

                  <p>
                    <strong>Rationale:</strong> {decision.rationale}
                  </p>

                  <p>
                    <strong>Human approval required:</strong>{" "}
                    {decision.humanApprovalRequired ? "Yes" : "No"}
                  </p>

                  <small>
                    Requirement IDs:{" "}
                    {decision.requirementIds.length > 0
                      ? decision.requirementIds.join(", ")
                      : "No direct requirement mapping"}
                  </small>
                </div>
              ))}
            </section>
          )}

          {activeTab === "responsible-ai" && (
            <section className="content-section">
              <h2>Responsible AI & Privacy</h2>

              {dataAISolution.responsibleAIItems.map((item) => (
                <div className="scope-card" key={item.id}>
                  <div className="scope-card-header">
                    <h3>{item.category}</h3>
                    <span className="tag">{item.priority}</span>
                  </div>

                  <p>{item.consideration}</p>

                  <p>
                    <strong>Proposed control:</strong>{" "}
                    {item.proposedControl}
                  </p>
                </div>
              ))}
            </section>
          )}

          {activeTab === "evaluation" && (
            <section className="content-section">
              <h2>AI Evaluation Criteria</h2>

              {dataAISolution.evaluationCriteria.map((criterion) => (
                <div className="scope-card" key={criterion.id}>
                  <h3>{criterion.name}</h3>

                  <p>{criterion.description}</p>

                  <p>
                    <strong>Measurement approach:</strong>{" "}
                    {criterion.measurementApproach}
                  </p>

                  <p>
                    <strong>Target:</strong> {criterion.target}
                  </p>
                </div>
              ))}
            </section>
          )}

          <section className="content-section">
            <h2>Assumptions</h2>

            <ul>
              {dataAISolution.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}