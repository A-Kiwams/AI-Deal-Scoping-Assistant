import type { ScopeAssumption } from "../../types";

interface AssumptionsReviewProps {
  assumptions: ScopeAssumption[];
  onUpdate: (assumptionId: string, updates: Partial<ScopeAssumption>) => void;
}

function AssumptionsReview({ assumptions, onUpdate }: AssumptionsReviewProps) {
  return (
    <div className="analysis-list">
      {assumptions.map((assumption) => (
        <div className="analysis-list-item" key={assumption.id}>
          <strong>
            {assumption.id}: {assumption.description}
          </strong>

          <p>{assumption.reason}</p>

          <label className="field-label">Review Status</label>

          <select
            value={assumption.status}
            onChange={(event) =>
              onUpdate(assumption.id, {
                status: event.target.value as ScopeAssumption["status"],
              })
            }
          >
            <option value="Needs Review">Needs Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AssumptionsReview;
