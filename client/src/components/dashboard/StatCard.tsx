interface StatCardProps {
  label: string;
  value: number;
  description: string;
}

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>

      <strong className="stat-value">{value}</strong>

      <span className="stat-description">{description}</span>
    </div>
  );
}
