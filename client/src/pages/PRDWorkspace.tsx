import { useState } from "react";
import { ArrowLeft, FileText, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSessionStore } from "../store/sessionStore";
import { generateFunctionalScope } from "../services/functionalScopeService";

function PRDWorkspace() {
  const navigate = useNavigate();

  const session = useSessionStore((state) => {
    if (!state.activeSessionId) return undefined;

    return state.sessions.find((item) => item.id === state.activeSessionId);
  });

  const saveFunctionalScope = useSessionStore(
    (state) => state.generateFunctionalScope,
  );

  const [isGenerating, setIsGenerating] = useState(false);

  if (!session) {
    return (
      <main className="page-container">
        <h1>No active session</h1>

        <button className="primary-button" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  if (!session.scopeModel) {
    return (
      <main className="page-container">
        <h1>Requirements analysis required</h1>

        <p>
          Analyze and review the requirements before generating the functional
          scope.
        </p>

        <button
          className="primary-button"
          onClick={() => navigate(`/requirements/${session.id}`)}
        >
          Go to Requirements Workspace
        </button>
      </main>
    );
  }

  const functionalScope = session.functionalScope;

  const handleGenerateScope = () => {
    setIsGenerating(true);

    const generatedScope = generateFunctionalScope(session.scopeModel!);

    saveFunctionalScope(session.id, generatedScope);

    setIsGenerating(false);
  };

  return (
    <main className="page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="page-heading">
        <div>
          <span className="eyebrow">PRD WORKSPACE</span>

          <h1>{session.name}</h1>

          <p>
            Generate a structured functional scope from the reviewed
            requirements.
          </p>
        </div>
      </div>

      {!functionalScope && (
        <section className="analysis-action-card">
          <div>
            <div className="analysis-icon">
              <FileText size={26} />
            </div>

            <h2>Generate Functional Scope</h2>

            <p>
              Organize reviewed requirements into capabilities, modules,
              workstreams, and delivery packages.
            </p>

            <small>This version uses the local Mock AI provider.</small>
          </div>

          <button
            className="primary-button"
            onClick={handleGenerateScope}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Scope"}
          </button>
        </section>
      )}

      {functionalScope && (
        <>
          <section className="workspace-card">
            <div className="section-heading">
              <div>
                <h2>Functional Scope Summary</h2>
                <p>Generated from the reviewed scope model.</p>
              </div>

              <span className="analysis-provider-badge">MOCK MODE</span>
            </div>

            <div className="analysis-summary-grid">
              <div className="summary-box">
                <strong>{functionalScope.capabilities.length}</strong>
                <span>Capabilities</span>
              </div>

              <div className="summary-box">
                <strong>{functionalScope.modules.length}</strong>
                <span>Modules</span>
              </div>

              <div className="summary-box">
                <strong>{functionalScope.workstreams.length}</strong>
                <span>Workstreams</span>
              </div>

              <div className="summary-box">
                <strong>{functionalScope.deliveryPackages.length}</strong>
                <span>Delivery Packages</span>
              </div>
            </div>
          </section>

          <section className="workspace-card">
            <h2>
              <Layers size={20} />
              Capabilities
            </h2>

            <div className="scope-card-grid">
              {functionalScope.capabilities.map((capability) => (
                <article className="scope-item-card" key={capability.id}>
                  <span className="scope-item-id">{capability.id}</span>

                  <h3>{capability.name}</h3>

                  <p>{capability.description}</p>

                  <span className="scope-origin">{capability.origin}</span>

                  <div className="coverage-list">
                    <strong>Requirement Coverage</strong>

                    {capability.requirementIds.length > 0 ? (
                      capability.requirementIds.map((id) => (
                        <span key={id}>{id}</span>
                      ))
                    ) : (
                      <span>No linked requirements</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="workspace-card">
            <h2>Modules</h2>

            <div className="scope-list">
              {functionalScope.modules.map((module) => (
                <article className="scope-list-item" key={module.id}>
                  <span className="scope-item-id">{module.id}</span>

                  <h3>{module.name}</h3>

                  <p>{module.description}</p>

                  <strong>Requirement IDs</strong>

                  <div className="tag-list">
                    {module.requirementIds.map((id) => (
                      <span key={id}>{id}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="workspace-card">
            <h2>Workstreams</h2>

            <div className="scope-list">
              {functionalScope.workstreams.map((workstream) => (
                <article className="scope-list-item" key={workstream.id}>
                  <span className="scope-item-id">{workstream.id}</span>

                  <h3>{workstream.name}</h3>

                  <p>{workstream.description}</p>

                  <strong>Linked Modules</strong>

                  <div className="tag-list">
                    {workstream.moduleIds.map((id) => (
                      <span key={id}>{id}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="workspace-card">
            <h2>Delivery Packages</h2>

            <div className="scope-list">
              {functionalScope.deliveryPackages.map((deliveryPackage) => (
                <article className="scope-list-item" key={deliveryPackage.id}>
                  <span className="scope-item-id">{deliveryPackage.id}</span>

                  <h3>{deliveryPackage.name}</h3>

                  <p>{deliveryPackage.description}</p>

                  <strong>Workstreams</strong>

                  <div className="tag-list">
                    {deliveryPackage.workstreamIds.map((id) => (
                      <span key={id}>{id}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="workspace-card">
            <h2>Out-of-Scope Items</h2>

            <div className="scope-list">
              {functionalScope.outOfScopeItems.map((item) => (
                <article className="scope-list-item" key={item.id}>
                  <span className="scope-item-id">{item.id}</span>

                  <h3>{item.description}</h3>

                  <p>{item.reason}</p>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default PRDWorkspace;
