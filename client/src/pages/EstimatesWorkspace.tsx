import { useState } from "react";
import {
  ArrowLeft,
  Calculator,
  RefreshCw,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../store/sessionStore";
import { generateEstimation } from "../services/estimationService";

export default function EstimatesWorkspace() {
  const navigate = useNavigate();

  const sessions = useSessionStore((state) => state.sessions);
  const activeSessionId = useSessionStore((state) => state.activeSessionId);
  const saveEstimation = useSessionStore(
    (state) => state.generateEstimation
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const session = sessions.find(
    (currentSession) => currentSession.id === activeSessionId
  );

  if (!session) {
    return (
      <div className="page-container">
        <h1>No active session</h1>
        <p>Create or select a scoping session first.</p>

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
          Analyze the requirements before generating an estimate.
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

  const estimation = session.estimationModel;

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const model = generateEstimation(
        session.scopeModel!,
        session.functionalScope
      );

      saveEstimation(session.id, model);
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

          <h1>Estimation & Commercials</h1>

          <p className="page-description">
            Build a transparent rough-order-of-magnitude estimate using
            visible effort, rates, assumptions, and contingency.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          <RefreshCw size={16} />
          {isGenerating ? "Generating..." : "Generate Estimate"}
        </button>
      </div>

      <div className="workspace-banner">
        <div>
          <strong>{session.name}</strong>
          <span>{session.customerName}</span>
        </div>

        <span className="status-badge">
          {estimation ? "Generated" : "Not Generated"}
        </span>
      </div>

      {!estimation && (
        <div className="empty-state">
          <Calculator size={42} />

          <h2>Generate your ROM estimate</h2>

          <p>
            The estimate will include effort, cost, timeline, contingency,
            and assumptions.
          </p>
        </div>
      )}

      {estimation && (
        <>
          <div className="estimate-summary-grid">
            <div className="summary-card">
              <DollarSign size={22} />
              <strong>
                {estimation.currency}{" "}
                {estimation.totalEstimate.toLocaleString()}
              </strong>
              <span>Total ROM Estimate</span>
            </div>

            <div className="summary-card">
              <Clock size={22} />
              <strong>{estimation.totalHours}</strong>
              <span>Total Hours</span>
            </div>

            <div className="summary-card">
              <strong>
                {estimation.estimatedDurationWeeks} weeks
              </strong>
              <span>Estimated Duration</span>
            </div>

            <div className="summary-card">
              <strong>{estimation.confidence}</strong>
              <span>Confidence</span>
            </div>
          </div>

          <section className="content-section">
            <h2>Commercial Summary</h2>

            <div className="commercial-summary">
              <div>
                <span>Delivery Subtotal</span>
                <strong>
                  {estimation.currency}{" "}
                  {estimation.subtotal.toLocaleString()}
                </strong>
              </div>

              <div>
                <span>
                  Contingency ({estimation.contingencyPercentage}%)
                </span>
                <strong>
                  {estimation.currency}{" "}
                  {estimation.contingencyAmount.toLocaleString()}
                </strong>
              </div>

              <div className="commercial-total">
                <span>Total ROM Estimate</span>
                <strong>
                  {estimation.currency}{" "}
                  {estimation.totalEstimate.toLocaleString()}
                </strong>
              </div>
            </div>
          </section>

          <section className="content-section">
            <h2>Effort Breakdown</h2>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Workstream</th>
                    <th>Role</th>
                    <th>Hours</th>
                    <th>Rate</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {estimation.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.workstreamName}</strong>
                        <p>{item.description}</p>
                      </td>

                      <td>{item.role}</td>
                      <td>{item.effortHours}</td>
                      <td>
                        {estimation.currency} {item.hourlyRate}
                      </td>
                      <td>
                        {estimation.currency}{" "}
                        {item.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="content-section">
            <h2>Delivery Timeline</h2>

            {estimation.timelinePhases.map((phase) => (
              <div className="scope-card" key={phase.id}>
                <div className="scope-card-header">
                  <h3>{phase.name}</h3>
                  <span className="tag">
                    {phase.durationWeeks} weeks
                  </span>
                </div>

                <p>{phase.description}</p>

                <p>
                  <strong>Dependencies:</strong>{" "}
                  {phase.dependencies.length > 0
                    ? phase.dependencies.join(", ")
                    : "None"}
                </p>

                <p>
                  <strong>Workstreams:</strong>{" "}
                  {phase.workstreamIds.join(", ")}
                </p>
              </div>
            ))}
          </section>

          <section className="content-section">
            <h2>Estimation Assumptions</h2>

            {estimation.assumptions.map((assumption) => (
              <div className="scope-card" key={assumption.id}>
                <h3>{assumption.description}</h3>

                <p>
                  <strong>Potential impact:</strong>{" "}
                  {assumption.impact}
                </p>

                <span className="tag">
                  {assumption.confirmed ? "Confirmed" : "Unconfirmed"}
                </span>
              </div>
            ))}
          </section>

          <section className="content-section">
            <h2>Limitations</h2>

            <ul>
              {estimation.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
          </section>

          <div className="disclaimer-box">
            <strong>ROM Estimate Disclaimer</strong>

            <p>
              This estimate is indicative only and is based on currently
              available requirements, assumptions, and mock estimation
              factors. It is not a fixed-price quotation or contractual
              commitment. Estimates must be reviewed and recalculated
              after detailed discovery.
            </p>
          </div>
        </>
      )}
    </div>
  );
}