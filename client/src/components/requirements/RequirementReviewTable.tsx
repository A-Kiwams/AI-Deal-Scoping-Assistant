import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";

import type {
  ScopeRequirement,
  RequirementOrigin,
  RequirementPriority,
} from "../../types";

interface RequirementReviewTableProps {
  requirements: ScopeRequirement[];
  onUpdate: (requirementId: string, updates: Partial<ScopeRequirement>) => void;
  onDelete: (requirementId: string) => void;
  onAdd: (requirement: ScopeRequirement) => void;
}

function RequirementReviewTable({
  requirements,
  onUpdate,
  onDelete,
  onAdd,
}: RequirementReviewTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState("");

  const startEditing = (requirement: ScopeRequirement) => {
    setEditingId(requirement.id);
    setDraftDescription(requirement.description);
  };

  const saveDescription = (requirementId: string) => {
    onUpdate(requirementId, {
      description: draftDescription,
    });

    setEditingId(null);
  };

  const addNewRequirement = () => {
    const newRequirement: ScopeRequirement = {
      id: `FR_${String(requirements.length + 1).padStart(2, "0")}`,
      type: "FR",
      description: "New requirement",
      priority: "Unassigned",
      origin: "Assumed",
      sourceReferences: [],
      dependencies: [],
      openQuestions: [],
    };

    onAdd(newRequirement);
  };

  return (
    <div>
      <div className="review-toolbar">
        <h3>Review Requirements</h3>

        <button className="secondary-button" onClick={addNewRequirement}>
          <Plus size={16} />
          Add Requirement
        </button>
      </div>

      <div className="requirements-table-wrapper">
        <table className="requirements-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Origin</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requirements.map((requirement) => (
              <tr key={requirement.id}>
                <td>
                  <strong>{requirement.id}</strong>
                </td>

                <td>
                  <select
                    value={requirement.type}
                    onChange={(event) =>
                      onUpdate(requirement.id, {
                        type: event.target.value as ScopeRequirement["type"],
                      })
                    }
                  >
                    <option value="BR">BR</option>
                    <option value="FR">FR</option>
                    <option value="NFR">NFR</option>
                    <option value="INT">INT</option>
                    <option value="DATA">DATA</option>
                    <option value="SEC">SEC</option>
                    <option value="CONSTRAINT">CONSTRAINT</option>
                    <option value="DEPENDENCY">DEPENDENCY</option>
                  </select>
                </td>

                <td className="description-cell">
                  {editingId === requirement.id ? (
                    <div className="inline-editor">
                      <textarea
                        value={draftDescription}
                        onChange={(event) =>
                          setDraftDescription(event.target.value)
                        }
                      />

                      <button
                        className="icon-button"
                        onClick={() => saveDescription(requirement.id)}
                        title="Save description"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="description-button"
                      onClick={() => startEditing(requirement)}
                    >
                      {requirement.description}
                    </button>
                  )}
                </td>

                <td>
                  <select
                    value={requirement.priority}
                    onChange={(event) =>
                      onUpdate(requirement.id, {
                        priority: event.target.value as RequirementPriority,
                      })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </td>

                <td>
                  <select
                    value={requirement.origin}
                    onChange={(event) =>
                      onUpdate(requirement.id, {
                        origin: event.target.value as RequirementOrigin,
                      })
                    }
                  >
                    <option value="Customer-stated">Customer-stated</option>
                    <option value="AI-inferred">AI-inferred</option>
                    <option value="Assumed">Assumed</option>
                  </select>
                </td>

                <td>
                  <button
                    className="danger-icon-button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Delete ${requirement.id}?`,
                      );

                      if (confirmed) {
                        onDelete(requirement.id);
                      }
                    }}
                    title="Delete requirement"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequirementReviewTable;
