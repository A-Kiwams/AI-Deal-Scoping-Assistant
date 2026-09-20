import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { useSessionStore } from "../store/sessionStore";
import type { CloudPlatform } from "../types";

export default function NewSession() {
  const navigate = useNavigate();

  const createSession = useSessionStore((state) => state.createSession);

  const [customerName, setCustomerName] = useState("");
  const [opportunityName, setOpportunityName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [preferredCloud, setPreferredCloud] =
    useState<CloudPlatform>("Undecided");
  const [rawRequirements, setRawRequirements] = useState("");
  const [sourceType, setSourceType] = useState<
    "text" | "markdown" | "rfp" | "discovery-notes"
  >("text");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!customerName.trim() || !opportunityName.trim()) {
      alert("Please enter the customer and opportunity names.");
      return;
    }

    if (!rawRequirements.trim()) {
      alert("Please enter the customer requirements.");
      return;
    }

    const sessionId = createSession({
      name: opportunityName,
      customerName,
      customerContext: {
        customerName,
        opportunityName,
        industry,
        description,
      },
      preferredCloud,
      rawRequirements,
      sourceType,
    });

    navigate(`/requirements/${sessionId}`);
  };

  return (
    <div className="form-page">
      <div className="form-page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <span className="eyebrow">NEW WORKSPACE</span>

        <h1>Create Scoping Session</h1>

        <p>
          Provide the initial customer context and requirements to begin your
          solution-scoping journey.
        </p>
      </div>

      <form className="session-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Customer Context</h2>

          <div className="form-grid">
            <div className="form-field">
              <label>Customer Name *</label>

              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="e.g. Acme Corporation"
              />
            </div>

            <div className="form-field">
              <label>Opportunity Name *</label>

              <input
                value={opportunityName}
                onChange={(event) => setOpportunityName(event.target.value)}
                placeholder="e.g. Customer Portal Modernization"
              />
            </div>

            <div className="form-field">
              <label>Industry</label>

              <input
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                placeholder="e.g. Financial Services"
              />
            </div>

            <div className="form-field">
              <label>Preferred Cloud Platform</label>

              <select
                value={preferredCloud}
                onChange={(event) =>
                  setPreferredCloud(event.target.value as CloudPlatform)
                }
              >
                <option value="Undecided">Undecided</option>
                <option value="AWS">Amazon Web Services</option>
                <option value="Azure">Microsoft Azure</option>
                <option value="GCP">Google Cloud Platform</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Opportunity Description</label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the business opportunity..."
              rows={4}
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Customer Requirements</h2>

          <div className="form-field">
            <label>Source Type</label>

            <select
              value={sourceType}
              onChange={(event) =>
                setSourceType(
                  event.target.value as
                    | "text"
                    | "markdown"
                    | "rfp"
                    | "discovery-notes",
                )
              }
            >
              <option value="text">Plain Text</option>
              <option value="markdown">Markdown</option>
              <option value="rfp">RFP</option>
              <option value="discovery-notes">Discovery Call Notes</option>
            </select>
          </div>

          <div className="form-field">
            <label>Requirements *</label>

            <textarea
              value={rawRequirements}
              onChange={(event) => setRawRequirements(event.target.value)}
              placeholder="Paste the customer's requirements here..."
              rows={14}
            />

            <small>
              Include business goals, functional requirements, technical
              constraints, integrations, and security expectations where
              available.
            </small>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            <Save size={18} />
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
}
