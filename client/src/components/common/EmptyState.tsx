import type { ReactNode } from "react";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FileSearch size={28} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}