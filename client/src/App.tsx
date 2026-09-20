import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import NewSession from "./pages/NewSession";
import RequirementsWorkspace from "./pages/RequirementsWorkspace";

import PRDWorkspace from "./pages/PRDWorkspace";
import ArchitectureWorkspace from "./pages/ArchitectureWorkspace";

import DataAIWorkspace from "./pages/DataAIWorkspace";
import EstimatesWorkspace from "./pages/EstimatesWorkspace";

import QualityGateWorkspace from "./pages/QualityGateWorkspace";
import ChangeImpactWorkspace from "./pages/ChangeImpactWorkspace";

import ExportWorkspace from "./pages/ExportWorkspace";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>
      <p>This workspace will be built in a later phase.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />

        <div className="main-area">
          <Topbar />

          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route path="/sessions/new" element={<NewSession />} />

              <Route
                path="/requirements/:sessionId"
                element={<RequirementsWorkspace />}
              />

              <Route
                path="/requirements"
                element={<PlaceholderPage title="Requirements Workspace" />}
              />

              <Route path="/prd" element={<PRDWorkspace />} />

              <Route path="/architecture" element={<ArchitectureWorkspace />} />

              <Route path="/data-ai" element={<DataAIWorkspace />} />

              <Route path="/estimates" element={<EstimatesWorkspace />} />
              
              <Route path="/quality-gate" element={<QualityGateWorkspace />} />

              <Route path="/change-impact" element={<ChangeImpactWorkspace />}/>

              <Route path="/export" element={<ExportWorkspace />}/>

              <Route
                path="/settings"
                element={<PlaceholderPage title="Settings" />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
