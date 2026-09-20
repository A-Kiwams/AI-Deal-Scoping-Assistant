
import {
  LayoutDashboard,
  FileText,
  Boxes,
  Database,
  Calculator,
  Settings,
  ShieldCheck,
  GitBranch,
  FileDown,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Requirements",
    path: "/requirements",
    icon: FileText,
  },
  {
    label: "PRD & Scope",
    path: "/prd",
    icon: Boxes,
  },
  {
    label: "Architecture",
    path: "/architecture",
    icon: Boxes,
  },
  {
    label: "Data & AI",
    path: "/data-ai",
    icon: Database,
  },
  {
    label: "Estimates",
    path: "/estimates",
    icon: Calculator,
  },
  {
    label: "Quality Gate",
    path: "/quality-gate",
    icon: ShieldCheck,
  },
  {
    label: "Change Impact",
    path: "/change-impact",
    icon: GitBranch,
  },
  {
    label: "Export",
    path: "/export",
    icon: FileDown,
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">S</div>
        <span>ScopeAI</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-heading">WORKSPACE</p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
