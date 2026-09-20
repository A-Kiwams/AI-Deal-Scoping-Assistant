import type {
  ArchitectureModel,
  DataAISolutionModel,
  EstimationModel,
  FunctionalScopeModel,
  QualityCheckResult,
  QualityGateModel,
  ScopeModel,
} from "../types";

interface QualityGateInputs {
  scopeModel: ScopeModel;
  functionalScope?: FunctionalScopeModel;
  architectureModel?: ArchitectureModel;
  dataAISolution?: DataAISolutionModel;
  estimationModel?: EstimationModel;
}

export function runQualityGate(
  inputs: QualityGateInputs
): QualityGateModel {
  const {
    scopeModel,
    functionalScope,
    architectureModel,
    dataAISolution,
    estimationModel,
  } = inputs;

  const results: QualityCheckResult[] = [];

  const requirements = scopeModel.requirements;

  // Check 1: Requirements without a description
  const emptyDescriptions = requirements.filter(
    (requirement) => !requirement.description.trim()
  );

  results.push({
    id: "QUALITY_01",
    category: "Requirements",
    title: "Requirements have descriptions",
    description: `${emptyDescriptions.length} requirement(s) have missing descriptions.`,
    severity: emptyDescriptions.length > 0 ? "Error" : "Info",
    status: emptyDescriptions.length > 0 ? "Failed" : "Passed",
    relatedIds: emptyDescriptions.map((requirement) => requirement.id),
    recommendation:
      "Add a clear, testable description to every requirement.",
  });

  // Check 2: Unassigned priorities
  const unassignedPriorities = requirements.filter(
    (requirement) => requirement.priority === "Unassigned"
  );

  results.push({
    id: "QUALITY_02",
    category: "Requirements",
    title: "Requirements have assigned priorities",
    description: `${unassignedPriorities.length} requirement(s) have no assigned priority.`,
    severity: unassignedPriorities.length > 0 ? "Warning" : "Info",
    status:
      unassignedPriorities.length > 0 ? "Needs Review" : "Passed",
    relatedIds: unassignedPriorities.map((requirement) => requirement.id),
    recommendation:
      "Review each requirement and assign High, Medium, or Low priority.",
  });

  // Check 3: Clarification questions
  const unresolvedQuestions = scopeModel.clarificationQuestions.filter(
    (question) => question.status !== "Resolved"
  );

  results.push({
    id: "QUALITY_03",
    category: "Requirements",
    title: "Clarification questions are resolved",
    description: `${unresolvedQuestions.length} clarification question(s) remain unresolved.`,
    severity: unresolvedQuestions.length > 0 ? "Warning" : "Info",
    status:
      unresolvedQuestions.length > 0 ? "Needs Review" : "Passed",
    relatedIds: unresolvedQuestions.map((question) => question.id),
    recommendation:
      "Resolve open questions or explicitly document them as delivery assumptions.",
  });

  // Check 4: Requirement traceability
  if (functionalScope) {
    const coveredRequirementIds = new Set<string>();

    functionalScope.capabilities.forEach((capability) => {
      capability.requirementIds.forEach((id) =>
        coveredRequirementIds.add(id)
      );
    });

    functionalScope.modules.forEach((module) => {
      module.requirementIds.forEach((id) =>
        coveredRequirementIds.add(id)
      );
    });

    const uncoveredRequirements = requirements.filter(
      (requirement) => !coveredRequirementIds.has(requirement.id)
    );

    results.push({
      id: "QUALITY_04",
      category: "Traceability",
      title: "Requirements have functional-scope coverage",
      description: `${uncoveredRequirements.length} requirement(s) are not linked to the functional scope.`,
      severity: uncoveredRequirements.length > 0 ? "Warning" : "Info",
      status:
        uncoveredRequirements.length > 0 ? "Needs Review" : "Passed",
      relatedIds: uncoveredRequirements.map(
        (requirement) => requirement.id
      ),
      recommendation:
        "Link each in-scope requirement to a capability, module, or delivery package.",
    });
  } else {
    results.push({
      id: "QUALITY_05",
      category: "Traceability",
      title: "Functional scope has been generated",
      description: "Functional scope has not yet been generated.",
      severity: "Error",
      status: "Failed",
      relatedIds: [],
      recommendation:
        "Generate and review the functional scope before proceeding.",
    });
  }

  // Check 5: Architecture availability
  if (!architectureModel) {
    results.push({
      id: "QUALITY_06",
      category: "Architecture",
      title: "Architecture model exists",
      description: "No architecture model has been generated.",
      severity: "Error",
      status: "Failed",
      relatedIds: [],
      recommendation:
        "Generate an architecture model and review its service selections.",
    });
  } else {
    const componentsWithoutTraceability =
      architectureModel.components.filter(
        (component) => component.requirementIds.length === 0
      );

    results.push({
      id: "QUALITY_07",
      category: "Architecture",
      title: "Architecture components have traceability",
      description: `${componentsWithoutTraceability.length} architecture component(s) have no requirement mapping.`,
      severity:
        componentsWithoutTraceability.length > 0 ? "Warning" : "Info",
      status:
        componentsWithoutTraceability.length > 0
          ? "Needs Review"
          : "Passed",
      relatedIds: componentsWithoutTraceability.map(
        (component) => component.id
      ),
      recommendation:
        "Document the purpose of unmapped components or link them to relevant requirements.",
    });
  }

  // Check 6: Integration details
  const integrationRequirements = requirements.filter(
    (requirement) =>
      requirement.type === "INT" || requirement.type === "DATA"
  );

  if (integrationRequirements.length > 0 && !dataAISolution) {
    results.push({
      id: "QUALITY_08",
      category: "Data & AI",
      title: "Data and integration analysis exists",
      description:
        "Integration or data requirements exist, but no Data & AI model has been generated.",
      severity: "Error",
      status: "Failed",
      relatedIds: integrationRequirements.map(
        (requirement) => requirement.id
      ),
      recommendation:
        "Generate the Data & AI solution model and review integration considerations.",
    });
  } else if (dataAISolution) {
    const unresolvedIntegrations = dataAISolution.integrations.filter(
      (integration) => integration.status !== "Confirmed"
    );

    results.push({
      id: "QUALITY_09",
      category: "Data & AI",
      title: "Integration details have been confirmed",
      description: `${unresolvedIntegrations.length} integration(s) are not confirmed.`,
      severity:
        unresolvedIntegrations.length > 0 ? "Warning" : "Info",
      status:
        unresolvedIntegrations.length > 0 ? "Needs Review" : "Passed",
      relatedIds: unresolvedIntegrations.map(
        (integration) => integration.id
      ),
      recommendation:
        "Confirm integration protocols, authentication methods, API limits, and ownership.",
    });
  }

  // Check 7: Responsible AI
  const hasAIRequirements = requirements.some(
    (requirement) =>
      requirement.description.toLowerCase().includes("ai") ||
      requirement.description.toLowerCase().includes("machine learning")
  );

  if (hasAIRequirements && !dataAISolution) {
    results.push({
      id: "QUALITY_10",
      category: "Data & AI",
      title: "Responsible AI review exists",
      description:
        "AI-related language was detected, but no Data & AI model exists.",
      severity: "Warning",
      status: "Needs Review",
      relatedIds: [],
      recommendation:
        "Review privacy, security, transparency, evaluation, and human oversight requirements.",
    });
  } else if (dataAISolution) {
    const highPriorityResponsibleAIItems =
      dataAISolution.responsibleAIItems.filter(
        (item) => item.priority === "High"
      );

    results.push({
      id: "QUALITY_11",
      category: "Data & AI",
      title: "Responsible AI considerations are documented",
      description: `${highPriorityResponsibleAIItems.length} high-priority Responsible AI consideration(s) were documented.`,
      severity: "Info",
      status: "Passed",
      relatedIds: highPriorityResponsibleAIItems.map((item) => item.id),
      recommendation:
        "Validate the proposed controls with security, privacy, and business stakeholders.",
    });
  }

  // Check 8: Estimation availability
  if (!estimationModel) {
    results.push({
      id: "QUALITY_12",
      category: "Estimation",
      title: "ROM estimate exists",
      description: "No effort or commercial estimate has been generated.",
      severity: "Error",
      status: "Failed",
      relatedIds: [],
      recommendation:
        "Generate a ROM estimate and review the assumptions and exclusions.",
    });
  } else {
    const invalidLineItems = estimationModel.lineItems.filter(
      (item) =>
        item.effortHours <= 0 ||
        item.hourlyRate <= 0 ||
        item.subtotal <= 0
    );

    results.push({
      id: "QUALITY_13",
      category: "Estimation",
      title: "Estimate line items contain valid values",
      description: `${invalidLineItems.length} estimate line item(s) have invalid effort or rate values.`,
      severity: invalidLineItems.length > 0 ? "Error" : "Info",
      status:
        invalidLineItems.length > 0 ? "Failed" : "Passed",
      relatedIds: invalidLineItems.map((item) => item.id),
      recommendation:
        "Review effort hours, rates, and calculated subtotals.",
    });

    results.push({
      id: "QUALITY_14",
      category: "Estimation",
      title: "Estimate limitations are documented",
      description: `${estimationModel.limitations.length} limitation(s) are documented.`,
      severity:
        estimationModel.limitations.length === 0 ? "Warning" : "Info",
      status:
        estimationModel.limitations.length === 0
          ? "Needs Review"
          : "Passed",
      relatedIds: [],
      recommendation:
        "Document uncertainty, exclusions, dependencies, and factors that may affect the estimate.",
    });
  }

  // Check 9: Assumptions
  const unresolvedAssumptions = scopeModel.assumptions.filter(
    (assumption) => assumption.status !== "Confirmed"
  );

  results.push({
    id: "QUALITY_15",
    category: "Assumptions",
    title: "Assumptions have been reviewed",
    description: `${unresolvedAssumptions.length} assumption(s) remain unconfirmed.`,
    severity:
      unresolvedAssumptions.length > 0 ? "Warning" : "Info",
    status:
      unresolvedAssumptions.length > 0 ? "Needs Review" : "Passed",
    relatedIds: unresolvedAssumptions.map(
      (assumption) => assumption.id
    ),
    recommendation:
      "Confirm assumptions with stakeholders or clearly document their impact.",
  });

  // Check 10: Requirement origin
  const unclassifiedRequirements = requirements.filter(
    (requirement) => !requirement.origin
  );

  results.push({
    id: "QUALITY_16",
    category: "Consistency",
    title: "Requirement origins are recorded",
    description: `${unclassifiedRequirements.length} requirement(s) have no recorded origin.`,
    severity:
      unclassifiedRequirements.length > 0 ? "Error" : "Info",
    status:
      unclassifiedRequirements.length > 0 ? "Failed" : "Passed",
    relatedIds: unclassifiedRequirements.map(
      (requirement) => requirement.id
    ),
    recommendation:
      "Identify whether each requirement is customer-stated, AI-inferred, or assumed.",
  });

  const failedChecks = results.filter(
    (result) => result.status === "Failed"
  ).length;

  const warningChecks = results.filter(
    (result) => result.status === "Needs Review"
  ).length;

  const passedChecks = results.filter(
    (result) => result.status === "Passed"
  ).length;

  const overallStatus =
    failedChecks > 0
      ? "Blocked"
      : warningChecks > 0
      ? "Passed with Warnings"
      : "Passed";

  return {
    results,
    summary: {
      totalChecks: results.length,
      passedChecks,
      failedChecks,
      warningChecks,
      overallStatus,
    },
    generatedAt: new Date().toISOString(),
    provider: "mock",
  };
}