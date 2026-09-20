import type { ClarificationQuestion } from "../../types";

interface ClarificationQuestionsProps {
  questions: ClarificationQuestion[];
  onUpdate: (
    questionId: string,
    updates: Partial<ClarificationQuestion>,
  ) => void;
}

function ClarificationQuestions({
  questions,
  onUpdate,
}: ClarificationQuestionsProps) {
  return (
    <div className="analysis-list">
      {questions.map((question) => (
        <div className="analysis-list-item" key={question.id}>
          <strong>
            {question.id}: {question.question}
          </strong>

          <p>{question.reason}</p>

          <div className="question-controls">
            <label className="field-label">Priority</label>

            <select
              value={question.priority}
              onChange={(event) =>
                onUpdate(question.id, {
                  priority: event.target
                    .value as ClarificationQuestion["priority"],
                })
              }
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <label className="field-label">Status</label>

            <select
              value={question.status}
              onChange={(event) =>
                onUpdate(question.id, {
                  status: event.target.value as ClarificationQuestion["status"],
                })
              }
            >
              <option value="Open">Open</option>
              <option value="Answered">Answered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClarificationQuestions;
