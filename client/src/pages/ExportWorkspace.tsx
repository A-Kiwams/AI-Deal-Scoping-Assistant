import { useState } from "react";
import {
  FileDown,
  FileText,
  FileType,
  Printer,
} from "lucide-react";

import { useSessionStore } from "../store/sessionStore";

import {
  buildMarkdownExport,
  downloadDocxFile,
  downloadMarkdownFile,
} from "../services/exportService";

export default function ExportWorkspace() {
  const session = useSessionStore((state) =>
    state.sessions.find(
      (item) => item.id === state.activeSessionId
    )
  );

  const [isExporting, setIsExporting] = useState(false);

  if (!session) {
    return (
      <div className="page-container">
        <h1>No active session</h1>
        <p>Create or select a session first.</p>
      </div>
    );
  }

  const markdown = buildMarkdownExport(session);

  const handleMarkdownExport = () => {
    downloadMarkdownFile(session);
  };

  const handleDocxExport = async () => {
    setIsExporting(true);

    try {
      await downloadDocxFile(session);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePdfExport = () => {
    window.print();
  };

  return (
    <div className="page-container export-page">
      <div className="page-heading export-toolbar">
        <div>
          <h1>Export Scoping Package</h1>
          <p>
            Export the integrated solution-scoping package for review
            and stakeholder sharing.
          </p>
        </div>

        <div className="export-actions">
          <button
            className="secondary-button"
            onClick={handleMarkdownExport}
          >
            <FileText size={18} />
            Markdown
          </button>

          <button
            className="secondary-button"
            onClick={handleDocxExport}
            disabled={isExporting}
          >
            <FileType size={18} />
            {isExporting ? "Creating DOCX..." : "DOCX"}
          </button>

          <button
            className="primary-button"
            onClick={handlePdfExport}
          >
            <Printer size={18} />
            Print / PDF
          </button>
        </div>
      </div>

      <section className="export-preview">
        <div className="export-preview-header">
          <div>
            <h2>Document Preview</h2>
            <p>
              Review the package before exporting it.
            </p>
          </div>

          <FileDown size={24} />
        </div>

        <pre className="markdown-preview">
          {markdown}
        </pre>
      </section>
    </div>
  );
}