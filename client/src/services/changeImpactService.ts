import type {
  ChangeImpact,
  ChangeImpactAnalysis,
  ScopeChange,
  ScopingSession,
} from "../types";

export function analyzeChangeImpact(
  session: ScopingSession,
  change: ScopeChange
): ChangeImpactAnalysis {
  const impacts: ChangeImpact[] = [];

  const requirementIds = change.relatedRequirementIds;

  const hasArchitecture = Boolean(session.architectureModel);
  const hasFunctionalScope = Boolean(session.functionalScope);
  const hasDataAI = Boolean(session.dataAISolution);
  const hasEstimate = Boolean(session.estimationModel);

  const addImpact = (
    outputArea: ChangeImpact["outputArea"],
    impactLevel: ChangeImpact["impactLevel"],
    reason: string,
    affectedIds: string[],
    recommendedAction: string,
    requiresRegeneration: boolean
  ) => {
    impacts.push({
      id: `IMPACT_${impacts.length + 1}`,
      outputArea,
      impactLevel,
      reason,
      affectedIds,
      recommendedAction,
      requiresRegeneration,
    });
  };

  if (change.changeType === "Requirement") {
    addImpact(
      "Requirements",
      "High",
      "A requirement-level change affects the reviewed scope baseline.",
      requirementIds,
      "Review the changed requirement and its origin, priority, and dependencies.",
      false
    );

    addImpact(
      "Functional Scope",
      hasFunctionalScope ? "High" : "None",
      hasFunctionalScope
        ? "Capabilities, modules, or delivery packages may depend on the changed requirement."
        : "Functional scope has not yet been generated.",
      requirementIds,
      "Review or regenerate functional scope mappings.",
      hasFunctionalScope
    );

    addImpact(
      "Architecture",
      hasArchitecture ? "Medium" : "None",
      hasArchitecture
        ? "The changed requirement may affect cloud components, services, or integration decisions."
        : "Architecture has not yet been generated.",
      requirementIds,
      "Review architecture components and requirement traceability.",
      hasArchitecture
    );

    addImpact(
      "Data & AI",
      hasDataAI ? "Medium" : "None",
      hasDataAI
        ? "Data flows, integrations, privacy controls, or AI decision points may be affected."
        : "The Data & AI model has not yet been generated.",
      requirementIds,
      "Review related data entities, flows, and integration considerations.",
      hasDataAI
    );

    addImpact(
      "Estimation",
      hasEstimate ? "High" : "None",
      hasEstimate
        ? "The changed requirement may alter effort, timeline, or commercial assumptions."
        : "An estimate has not yet been generated.",
      requirementIds,
      "Recalculate the estimate after reviewing the scope change.",
      hasEstimate
    );

    addImpact(
      "Quality Gate",
      "High",
      "A scope change may invalidate previous quality checks.",
      [],
      "Run the Quality Gate again after reviewing affected outputs.",
      true
    );
  }

  if (change.changeType === "Assumption") {
    addImpact(
      "Requirements",
      "Medium",
      "Changing an assumption may require clarification or requirement updates.",
      requirementIds,
      "Review requirements dependent on the changed assumption.",
      false
    );

    addImpact(
      "Architecture",
      hasArchitecture ? "Medium" : "None",
      "Architecture decisions may depend on technical or business assumptions.",
      requirementIds,
      "Review architecture rationale and tradeoffs.",
      hasArchitecture
    );

    addImpact(
      "Data & AI",
      hasDataAI ? "Medium" : "None",
      "Data retention, privacy, integration, or AI assumptions may be affected.",
      requirementIds,
      "Review affected data and AI considerations.",
      hasDataAI
    );

    addImpact(
      "Estimation",
      hasEstimate ? "High" : "None",
      "Assumption changes may alter effort, risk, and contingency.",
      requirementIds,
      "Review the estimate and recalculate affected line items.",
      hasEstimate
    );

    addImpact(
      "Quality Gate",
      "Medium",
      "Assumption changes may invalidate previous review results.",
      [],
      "Run the Quality Gate again.",
      true
    );
  }

  if (change.changeType === "Cloud Configuration") {
    addImpact(
      "Architecture",
      hasArchitecture ? "High" : "None",
      "Changing the cloud platform may affect services, integrations, security, and deployment design.",
      [],
      "Regenerate the architecture for the selected cloud platform.",
      hasArchitecture
    );

    addImpact(
      "Data & AI",
      hasDataAI ? "Medium" : "None",
      "Cloud service changes may affect data services, AI services, and integration options.",
      [],
      "Review cloud-specific data and AI service recommendations.",
      hasDataAI
    );

    addImpact(
      "Estimation",
      hasEstimate ? "Medium" : "None",
      "Cloud changes may affect implementation and operational effort.",
      [],
      "Review infrastructure and deployment effort.",
      hasEstimate
    );

    addImpact(
      "Quality Gate",
      "Medium",
      "Cloud configuration changes may invalidate architecture checks.",
      [],
      "Run the Quality Gate again after reviewing the architecture.",
      true
    );
  }

  if (change.changeType === "Scope Configuration") {
    addImpact(
      "Functional Scope",
      hasFunctionalScope ? "High" : "None",
      "Scope configuration changes may alter capabilities, modules, and delivery packages.",
      [],
      "Review and regenerate the functional scope.",
      hasFunctionalScope
    );

    addImpact(
      "Estimation",
      hasEstimate ? "High" : "None",
      "Scope configuration changes may alter the amount of delivery effort.",
      [],
      "Recalculate effort and commercial estimates.",
      hasEstimate
    );

    addImpact(
      "Quality Gate",
      "High",
      "Scope changes may invalidate previous quality checks.",
      [],
      "Run the Quality Gate again.",
      true
    );
  }

  return {
    change,
    impacts,
    generatedAt: new Date().toISOString(),
    provider: "mock",
  };
}