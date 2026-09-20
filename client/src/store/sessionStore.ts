import { create } from "zustand";
import { createOutputVersion } from "../services/versioningService";
import type {
  OutputFreshness,
  OutputVersion,
  VersionedOutputArea,
  ChangeImpactAnalysis,
  ScopeChange,
  QualityGateModel,
  DataAISolutionModel,
  ScopeModel,
  ScopingSession,
  AnalysisStatus,
  ScopeRequirement,
  ScopeAssumption,
  ClarificationQuestion,
  FunctionalScopeModel,
  ArchitectureModel,
  EstimationModel,
} from "../types";

interface SessionState {

  addOutputVersion: (
  sessionId: string,
  outputArea: VersionedOutputArea,
  title: string,
  snapshot: unknown,
  provider: "mock" | "live",
  changeId?: string
) => void;

markOutputOutdated: (
  sessionId: string,
  outputAreas: VersionedOutputArea[],
  reason: string,
  changeId: string
) => void;

getOutputVersions: (
  sessionId: string,
  outputArea: VersionedOutputArea
) => OutputVersion[];

addScopeChange: (sessionId: string, change: ScopeChange) => void;

saveChangeImpact: (
  sessionId: string,
  analysis: ChangeImpactAnalysis
) => void;

  runQualityGate: (
  sessionId: string,
  qualityGate: QualityGateModel
) => void;

  generateEstimation: (
  sessionId: string,
  estimationModel: EstimationModel
) => void;

   generateDataAISolution: (
  sessionId: string,
  dataAISolution: DataAISolutionModel
) => void;

  generateArchitecture: (
    sessionId: string,
    architectureModel: ArchitectureModel,
  ) => void;
  generateFunctionalScope: (
    sessionId: string,
    functionalScope: FunctionalScopeModel,
  ) => void;
  sessions: ScopingSession[];
  activeSessionId: string | null;

  createSession: (
    sessionData: Omit<
      ScopingSession,
      "id" | "updatedAt" | "status" | "analysisStatus"
    >,
  ) => string;

  getActiveSession: () => ScopingSession | undefined;

  updateAnalysisStatus: (sessionId: string, status: AnalysisStatus) => void;

  saveScopeModel: (sessionId: string, scopeModel: ScopeModel) => void;

  updateRequirement: (
    sessionId: string,
    requirementId: string,
    updates: Partial<ScopeRequirement>,
  ) => void;

  deleteRequirement: (sessionId: string, requirementId: string) => void;

  addRequirement: (sessionId: string, requirement: ScopeRequirement) => void;

  updateAssumption: (
    sessionId: string,
    assumptionId: string,
    updates: Partial<ScopeAssumption>,
  ) => void;

  updateClarificationQuestion: (
    sessionId: string,
    questionId: string,
    updates: Partial<ClarificationQuestion>,
  ) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],

  activeSessionId: null,

  createSession: (sessionData) => {
    const id = crypto.randomUUID();

    const newSession: ScopingSession = {
      ...sessionData,
      id,
      status: "Draft",
      analysisStatus: "Not Started",
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeSessionId: id,
    }));

    return id;
  },

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();

    return sessions.find((session) => session.id === activeSessionId);
  },

  updateAnalysisStatus: (sessionId, status) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              analysisStatus: status,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    }));
  },

  saveScopeModel: (sessionId, scopeModel) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              scopeModel,
              analysisStatus: "Analyzed",
              status: "In Review",
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    }));
  },

  updateRequirement: (sessionId, requirementId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId || !session.scopeModel) {
          return session;
        }

        return {
          ...session,
          updatedAt: new Date().toISOString(),
          scopeModel: {
            ...session.scopeModel,
            requirements: session.scopeModel.requirements.map((requirement) =>
              requirement.id === requirementId
                ? { ...requirement, ...updates }
                : requirement,
            ),
          },
        };
      }),
    }));
  },

  deleteRequirement: (sessionId, requirementId) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId || !session.scopeModel) {
          return session;
        }

        return {
          ...session,
          updatedAt: new Date().toISOString(),
          scopeModel: {
            ...session.scopeModel,
            requirements: session.scopeModel.requirements.filter(
              (requirement) => requirement.id !== requirementId,
            ),
          },
        };
      }),
    }));
  },

  addRequirement: (sessionId, requirement) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId || !session.scopeModel) {
          return session;
        }

        return {
          ...session,
          updatedAt: new Date().toISOString(),
          scopeModel: {
            ...session.scopeModel,
            requirements: [...session.scopeModel.requirements, requirement],
          },
        };
      }),
    }));
  },

  updateAssumption: (sessionId, assumptionId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId || !session.scopeModel) {
          return session;
        }

        return {
          ...session,
          updatedAt: new Date().toISOString(),
          scopeModel: {
            ...session.scopeModel,
            assumptions: session.scopeModel.assumptions.map((assumption) =>
              assumption.id === assumptionId
                ? { ...assumption, ...updates }
                : assumption,
            ),
          },
        };
      }),
    }));
  },

  updateClarificationQuestion: (sessionId, questionId, updates) => {
    set((state) => ({
      sessions: state.sessions.map((session) => {
        if (session.id !== sessionId || !session.scopeModel) {
          return session;
        }

        return {
          ...session,
          updatedAt: new Date().toISOString(),
          scopeModel: {
            ...session.scopeModel,
            clarificationQuestions:
              session.scopeModel.clarificationQuestions.map((question) =>
                question.id === questionId
                  ? { ...question, ...updates }
                  : question,
              ),
          },
        };
      }),
    }));
  },

  // Zustan store: generate functional scope
  generateFunctionalScope: (sessionId, functionalScope) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              functionalScope,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    }));
  },
  // generate architecture
  generateArchitecture: (sessionId, architectureModel) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              architectureModel,
              updatedAt: new Date().toISOString(),
            }
          : session,
      ),
    }));
  },

  generateDataAISolution: (sessionId, dataAISolution) => {
  set((state) => ({
    sessions: state.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            dataAISolution,
            updatedAt: new Date().toISOString(),
          }
        : session
    ),
  }));
},

generateEstimation: (sessionId, estimationModel) => {
  set((state) => ({
    sessions: state.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            estimationModel,
            updatedAt: new Date().toISOString(),
          }
        : session
    ),
  }));
},

runQualityGate: (sessionId, qualityGate) => {
  set((state) => ({
    sessions: state.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            qualityGate,
            updatedAt: new Date().toISOString(),
          }
        : session
    ),
  }));
},

addScopeChange: (sessionId, change) => {
  set((state) => ({
    sessions: state.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            changeHistory: [
              ...(session.changeHistory ?? []),
              change,
            ],
            updatedAt: new Date().toISOString(),
          }
        : session
    ),
  }));
},

saveChangeImpact: (sessionId, analysis) => {
  set((state) => ({
    sessions: state.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            lastChangeImpact: analysis,
            updatedAt: new Date().toISOString(),
          }
        : session
    ),
  }));
},


addOutputVersion: (
  sessionId,
  outputArea,
  title,
  snapshot,
  provider,
  changeId
) => {
  set((state) => ({
    sessions: state.sessions.map((session) => {
      if (session.id !== sessionId) {
        return session;
      }

      const existingVersions = session.outputVersions ?? [];

      const newVersion = createOutputVersion(
        existingVersions,
        outputArea,
        title,
        snapshot,
        provider,
        changeId
      );

      const updatedVersions = [
        ...existingVersions.map((version) => {
          if (version.outputArea === outputArea) {
            return {
              ...version,
              isCurrent: false,
            };
          }

          return version;
        }),
        newVersion,
      ];

      const existingFreshness = session.outputFreshness ?? [];

      const updatedFreshness: OutputFreshness[] =
        existingFreshness.map((item) => {
          if (item.outputArea !== outputArea) {
            return item;
          }

          return {
            ...item,
            status: "Current",
            lastGeneratedAt: newVersion.createdAt,
            outdatedReason: undefined,
            relatedChangeIds: item.relatedChangeIds,
          };
        });

      const hasFreshnessRecord = existingFreshness.some(
        (item) => item.outputArea === outputArea
      );

      if (!hasFreshnessRecord) {
        updatedFreshness.push({
          outputArea,
          status: "Current",
          lastGeneratedAt: newVersion.createdAt,
          relatedChangeIds: changeId ? [changeId] : [],
        });
      }

      return {
        ...session,
        outputVersions: updatedVersions,
        outputFreshness: updatedFreshness,
        updatedAt: new Date().toISOString(),
      };
    }),
  }));
},

markOutputOutdated: (
  sessionId,
  outputAreas,
  reason,
  changeId
) => {
  set((state) => ({
    sessions: state.sessions.map((session) => {
      if (session.id !== sessionId) {
        return session;
      }

      const existingFreshness = session.outputFreshness ?? [];

      const updatedFreshness = [...existingFreshness];

      outputAreas.forEach((outputArea) => {
        const existingIndex = updatedFreshness.findIndex(
          (item) => item.outputArea === outputArea
        );

        if (existingIndex >= 0) {
          const existingItem = updatedFreshness[existingIndex];

          updatedFreshness[existingIndex] = {
            ...existingItem,
            status: "Outdated",
            outdatedReason: reason,
            relatedChangeIds: Array.from(
              new Set([
                ...existingItem.relatedChangeIds,
                changeId,
              ])
            ),
          };
        } else {
          updatedFreshness.push({
            outputArea,
            status: "Outdated",
            outdatedReason: reason,
            relatedChangeIds: [changeId],
          });
        }
      });

      return {
        ...session,
        outputFreshness: updatedFreshness,
        updatedAt: new Date().toISOString(),
      };
    }),
  }));
},

getOutputVersions: (sessionId, outputArea) => {
  const session = get().sessions.find(
    (item) => item.id === sessionId
  );

  return (session?.outputVersions ?? [])
    .filter((version) => version.outputArea === outputArea)
    .sort((a, b) => b.versionNumber - a.versionNumber);
},





 
}));
