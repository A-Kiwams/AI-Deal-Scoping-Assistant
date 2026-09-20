import { useMemo, useState } from "react";
import { ArrowLeft, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useSessionStore } from "../store/sessionStore";
import { generateArchitecture } from "../services/architectureService";
import type { CloudPlatform } from "../types";

function ArchitectureWorkspace() {
  const navigate = useNavigate();

  const session = useSessionStore((state) => {
    if (!state.activeSessionId) return undefined;

    return state.sessions.find((item) => item.id === state.activeSessionId);
  });

  const saveArchitecture = useSessionStore(
    (state) => state.generateArchitecture,
  );

  const [selectedCloud, setSelectedCloud] = useState<CloudPlatform>(
    session?.preferredCloud || "Undecided",
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

        <p>Analyze the requirements before generating an architecture.</p>

        <button
          className="primary-button"
          onClick={() => navigate(`/requirements/${session.id}`)}
        >
          Go to Requirements Workspace
        </button>
      </main>
    );
  }

  const architecture = session.architectureModel;

  const nodes: Node[] = useMemo(() => {
    if (!architecture) return [];

    return architecture.components.map((component, index) => ({
      id: component.id,
      position: {
        x: (index % 3) * 280,
        y: Math.floor(index / 3) * 180,
      },
      data: {
        label: `${component.name}\n${component.cloudService}`,
      },
      style: {
        width: 230,
        whiteSpace: "pre-wrap",
        padding: 12,
        borderRadius: 8,
        border: "1px solid #cbd5e1",
        background: "#ffffff",
      },
    }));
  }, [architecture]);

  const edges: Edge[] = useMemo(() => {
    if (!architecture) return [];

    return architecture.connections.map((connection) => ({
      id: connection.id,
      source: connection.sourceComponentId,
      target: connection.targetComponentId,
      label: connection.label,
      animated: false,
    }));
  }, [architecture]);

  const handleGenerateArchitecture = () => {
    if (selectedCloud === "Undecided") {
      window.alert("Please select a cloud platform first.");
      return;
    }

    setIsGenerating(true);

    const generatedArchitecture = generateArchitecture(
      selectedCloud,
      session.scopeModel!,
    );

    saveArchitecture(session.id, generatedArchitecture);

    setIsGenerating(false);

      addOutputVersion(
  session.id,
  "Architecture",
  "Cloud Architecture",
  architectureModel,
  "mock",
  session.lastChangeImpact?.change.id
);

  };

  const addOutputVersion = useSessionStore(
  (state) => state.addOutputVersion
);

  <button
  className="primary-button"
  onClick={() => navigate("/data-ai")}
>
  Continue to Data & AI
</button>

  return (
    <main className="page-container">
      <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="page-heading">
        <div>
          <span className="eyebrow">ARCHITECTURE WORKSPACE</span>

          <h1>{session.name}</h1>

          <p>
            Explore cloud architecture options and requirement traceability.
          </p>
        </div>
      </div>

      <section className="workspace-card">
        <h2>Cloud Platform</h2>

        <label className="field-label">Select a target cloud platform</label>

        <select
          className="form-input"
          value={selectedCloud}
          onChange={(event) =>
            setSelectedCloud(event.target.value as CloudPlatform)
          }
        >
          <option value="Undecided">Undecided</option>
          <option value="AWS">AWS</option>
          <option value="Azure">Microsoft Azure</option>
          <option value="GCP">Google Cloud Platform</option>
        </select>

        <button
          className="primary-button"
          onClick={handleGenerateArchitecture}
          disabled={isGenerating}
        >
          <Network size={18} />

          {isGenerating ? "Generating..." : "Generate Architecture"}
        </button>
      </section>

      {architecture && (
        <>
          <section className="workspace-card">
            <div className="section-heading">
              <div>
                <h2>{architecture.cloudPlatform} Architecture</h2>

                <p>Preliminary architecture generated in Mock Mode.</p>
              </div>

              <span className="analysis-provider-badge">MOCK MODE</span>
            </div>

            <div className="architecture-diagram">
              <ReactFlow nodes={nodes} edges={edges} fitView>
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </section>

          <section className="workspace-card">
            <h2>Architecture Components</h2>

            <div className="scope-list">
              {architecture.components.map((component) => (
                <article className="scope-list-item" key={component.id}>
                  <span className="scope-item-id">{component.id}</span>

                  <h3>{component.name}</h3>

                  <p>{component.description}</p>

                  <p>
                    <strong>Cloud Service:</strong> {component.cloudService}
                  </p>

                  <p>
                    <strong>Rationale:</strong> {component.rationale}
                  </p>

                  <strong>Trade-offs</strong>

                  <ul>
                    {component.tradeoffs.map((tradeoff) => (
                      <li key={tradeoff}>{tradeoff}</li>
                    ))}
                  </ul>

                  <strong>Requirement Coverage</strong>

                  <div className="tag-list">
                    {component.requirementIds.length > 0 ? (
                      component.requirementIds.map((id) => (
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
            <h2>Architecture Assumptions</h2>

            <ul>
              {architecture.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

export default ArchitectureWorkspace;
