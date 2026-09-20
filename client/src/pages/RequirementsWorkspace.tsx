import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BrainCircuit, AlertCircle } from "lucide-react";

import { useSessionStore } from "../store/sessionStore";
import { analyzeRequirements } from "../services/analysisService";

import RequirementReviewTable from "../components/requirements/RequirementReviewTable";
import AssumptionsReview from "../components/requirements/AssumptionsReview";
import ClarificationQuestions from "../components/requirements/ClarificationQuestions";

function RequirementsWorkspace() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const session = useSessionStore((state) =>
    state.sessions.find((item) => item.id === sessionId),
  );

  const updateAnalysisStatus = useSessionStore(
    (state) => state.updateAnalysisStatus,
  );

  const updateRequirement = useSessionStore((state) => state.updateRequirement);

  const deleteRequirement = useSessionStore((state) => state.deleteRequirement);

  const addRequirement = useSessionStore((state) => state.addRequirement);

  const updateAssumption = useSessionStore((state) => state.updateAssumption);

  const updateClarificationQuestion = useSessionStore(
    (state) => state.updateClarificationQuestion,
  );

  const saveScopeModel = useSessionStore((state) => state.saveScopeModel);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!session) {
    return (
      <main className="page-container">
        <h1>Session not found</h1>

        <button className="primary-button" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  const handleAnalyzeRequirements = () => {
    setIsAnalyzing(true);
    setErrorMessage("");

    updateAnalysisStatus(session.id, "Analyzing");

    try {
      const scopeModel = analyzeRequirements(session.rawRequirements);

      saveScopeModel(session.id, scopeModel);
    } catch (error) {
      console.error(error);

      updateAnalysisStatus(session.id, "Failed");

      setErrorMessage(
        "The requirements could not be analyzed. Please check the console.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scopeModel = session.scopeModel;

  return (
    <main className="page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="page-heading">
        <div>
          <span className="eyebrow">REQUIREMENTS WORKSPACE</span>

          <h1>{session.name}</h1>

          <p>Analyze, review, and refine the customer requirements.</p>
        </div>

        <span className="status-badge">{session.status}</span>
      </div>

      <section className="workspace-card">
        <h2>Customer Context</h2>

        <div className="context-grid">
          <div>
            <strong>Customer</strong>
            <span>{session.customerContext.customerName}</span>
          </div>

          <div>
            <strong>Industry</strong>
            <span>{session.customerContext.industry || "Not specified"}</span>
          </div>

          <div>
            <strong>Cloud Platform</strong>
            <span>{session.preferredCloud}</span>
          </div>

          <div>
            <strong>Source Type</strong>
            <span>{session.sourceType}</span>
          </div>
        </div>

        <div className="description-block">
          <strong>Business Description</strong>
          <p>{session.customerContext.description}</p>
        </div>
      </section>

      <section className="workspace-card">
        <div className="section-heading">
          <div>
            <h2>Original Customer Requirements</h2>
            <p>This is the original source material used during analysis.</p>
          </div>
        </div>

        <pre className="requirements-preview">{session.rawRequirements}</pre>
      </section>

      <section className="analysis-action-card">
        <div>
          <div className="analysis-icon">
            <BrainCircuit size={26} />
          </div>

          <h2>Mock AI Requirements Analysis</h2>

          <p>
            Convert the raw requirements into structured, traceable scope items.
          </p>

          <small>
            This mode runs locally and does not require a paid AI provider.
          </small>
        </div>

        <button
          className="primary-button"
          onClick={handleAnalyzeRequirements}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Requirements"}
        </button>
      </section>

      {errorMessage && (
        <div className="error-message">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      {scopeModel && (
        <section className="workspace-card">
          <div className="section-heading">
            <div>
              <h2>Analysis Summary</h2>
              <p>Generated using the local Mock AI provider.</p>
            </div>

            <span className="analysis-provider-badge">
              {scopeModel.provider.toUpperCase()} MODE
            </span>
          </div>
          <div className="analysis-summary-grid">
            <div className="summary-box">
              <strong>{scopeModel.requirements.length}</strong>
              <span>Requirements</span>
            </div>

            <div className="summary-box">
              <strong>{scopeModel.assumptions.length}</strong>
              <span>Assumptions</span>
            </div>

            <div className="summary-box">
              <strong>{scopeModel.clarificationQuestions.length}</strong>
              <span>Open Questions</span>
            </div>
          </div>

          {session.scopeModel && (
            <button className="primary-button" onClick={() => navigate("/prd")}>
              Open PRD Workspace
            </button>
          )}
          <h3>Structured Requirements</h3>
          <div className="requirements-table-wrapper">
            <RequirementReviewTable
              requirements={scopeModel.requirements}
              onUpdate={(requirementId, updates) =>
                updateRequirement(session.id, requirementId, updates)
              }
              onDelete={(requirementId) =>
                deleteRequirement(session.id, requirementId)
              }
              onAdd={(requirement) => addRequirement(session.id, requirement)}
            />
          </div>
          <h3>Assumptions</h3>
          <div className="analysis-list">
            <AssumptionsReview
              assumptions={scopeModel.assumptions}
              onUpdate={(assumptionId, updates) =>
                updateAssumption(session.id, assumptionId, updates)
              }
            />
          </div>
          <h3>Clarification Questions</h3>
          <div className="analysis-list">
            <ClarificationQuestions
              questions={scopeModel.clarificationQuestions}
              onUpdate={(questionId, updates) =>
                updateClarificationQuestion(session.id, questionId, updates)
              }
            />
          </div>
        </section>
      )}
    </main>
  );
}

export default RequirementsWorkspace;
