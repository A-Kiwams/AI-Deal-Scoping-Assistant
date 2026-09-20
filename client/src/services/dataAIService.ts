import type {
  AIEvaluationCriterion,
  AIDecisionPoint,
  DataAISolutionModel,
  DataEntity,
  DataFlow,
  IntegrationConsideration,
  ResponsibleAIItem,
  ScopeModel,
} from "../types";

export function generateDataAISolution(
  scopeModel: ScopeModel
): DataAISolutionModel {
  const requirementIds = scopeModel.requirements.map(
    (requirement) => requirement.id
  );

  const findRequirementId = (type: string, index: number): string => {
    const matchingRequirement = scopeModel.requirements.filter(
      (requirement) => requirement.type === type
    )[index];

    return matchingRequirement?.id ?? requirementIds[0] ?? "UNMAPPED";
  };

  const dataEntities: DataEntity[] = [
    {
      id: "DATA_ENTITY_01",
      name: "Customer Profile",
      description:
        "Stores customer identity, contact details, account information, and profile preferences.",
      source: "Customer portal and existing CRM",
      classification: "Confidential",
      retentionNotes:
        "Retention period must be confirmed with the customer and applicable policies.",
      requirementIds: [findRequirementId("FR", 0)],
    },
    {
      id: "DATA_ENTITY_02",
      name: "Service Request",
      description:
        "Stores requests submitted by customers, request status, timestamps, and resolution details.",
      source: "Customer portal",
      classification: "Confidential",
      retentionNotes:
        "Retention should align with business and regulatory requirements.",
      requirementIds: [findRequirementId("FR", 1)],
    },
    {
      id: "DATA_ENTITY_03",
      name: "Notification Event",
      description:
        "Represents events that trigger customer email notifications.",
      source: "Service request workflow",
      classification: "Internal",
      retentionNotes:
        "Event retention and audit requirements must be confirmed.",
      requirementIds: [findRequirementId("FR", 2)],
    },
  ];

  const dataFlows: DataFlow[] = [
    {
      id: "DATA_FLOW_01",
      name: "Customer Profile Synchronization",
      source: "Existing CRM",
      destination: "Customer Portal Backend",
      description:
        "Synchronizes customer profile information between the existing CRM and the portal.",
      dataTransferred: [
        "Customer identifier",
        "Customer profile information",
        "Account status",
      ],
      securityConsiderations: [
        "Use encrypted communication.",
        "Apply least-privilege access.",
        "Record synchronization failures.",
      ],
      requirementIds: [findRequirementId("INT", 0)],
    },
    {
      id: "DATA_FLOW_02",
      name: "Service Request Submission",
      source: "Customer Portal",
      destination: "Service Request Store",
      description:
        "Persists customer-submitted service requests for processing and tracking.",
      dataTransferred: [
        "Customer identifier",
        "Request details",
        "Request status",
        "Created and updated timestamps",
      ],
      securityConsiderations: [
        "Validate submitted data.",
        "Protect customer information at rest.",
        "Apply access controls.",
      ],
      requirementIds: [findRequirementId("FR", 1)],
    },
    {
      id: "DATA_FLOW_03",
      name: "Status Change Notification",
      source: "Service Request Workflow",
      destination: "Email Notification Service",
      description:
        "Sends notification events when a service request changes status.",
      dataTransferred: [
        "Customer email address",
        "Request reference",
        "New request status",
      ],
      securityConsiderations: [
        "Avoid exposing sensitive information in email content.",
        "Monitor failed deliveries.",
      ],
      requirementIds: [findRequirementId("FR", 2)],
    },
  ];

  const integrations: IntegrationConsideration[] = [
    {
      id: "INT_CONSIDERATION_01",
      systemName: "Existing CRM",
      purpose:
        "Provide customer account information and maintain synchronization with the portal.",
      integrationMethod:
        "CRM API integration; exact API approach to be confirmed.",
      status: "To be confirmed",
      openQuestions: [
        "Which CRM platform is currently in use?",
        "Is the CRM API REST, SOAP, or another protocol?",
        "What authentication mechanism is required?",
        "What are the CRM API rate limits?",
      ],
      requirementIds: [findRequirementId("INT", 0)],
    },
    {
      id: "INT_CONSIDERATION_02",
      systemName: "Email Notification Provider",
      purpose:
        "Deliver email notifications when service request statuses change.",
      integrationMethod:
        "Provider API or cloud-native messaging and email service.",
      status: "Assumed",
      openQuestions: [
        "Does the customer have an existing email provider?",
        "Are delivery tracking and bounce handling required?",
      ],
      requirementIds: [findRequirementId("FR", 2)],
    },
  ];

  const aiDecisionPoints: AIDecisionPoint[] = [
    {
      id: "AI_DECISION_01",
      name: "Customer Request Categorization",
      description:
        "Optionally classify incoming service requests into predefined categories.",
      processingType: "AI-assisted",
      proposedTechnology:
        "A classification model or managed language AI service",
      rationale:
        "AI may help reduce manual categorization effort, but the feature is not explicitly required.",
      humanApprovalRequired: true,
      requirementIds: [],
    },
    {
      id: "AI_DECISION_02",
      name: "Service Request Routing",
      description:
        "Recommend the appropriate internal team for a submitted service request.",
      processingType: "AI-assisted",
      proposedTechnology:
        "Rules-based routing with optional machine-learning recommendations",
      rationale:
        "Deterministic rules should handle mandatory routing decisions, while AI may provide recommendations.",
      humanApprovalRequired: true,
      requirementIds: [],
    },
    {
      id: "AI_DECISION_03",
      name: "Account and Request Processing",
      description:
        "Handle registration, account lookup, request submission, and status changes.",
      processingType: "Deterministic",
      proposedTechnology: "Application business logic and workflow services",
      rationale:
        "These operations should be predictable, auditable, and governed by explicit business rules.",
      humanApprovalRequired: false,
      requirementIds: [
        findRequirementId("FR", 0),
        findRequirementId("FR", 1),
      ],
    },
  ];

  const responsibleAIItems: ResponsibleAIItem[] = [
    {
      id: "RAI_01",
      category: "Privacy",
      consideration:
        "Customer information may be processed by application and integration services.",
      proposedControl:
        "Minimize collected data, define retention rules, and restrict access to sensitive information.",
      priority: "High",
    },
    {
      id: "RAI_02",
      category: "Security",
      consideration:
        "Customer data must be protected during storage and transmission.",
      proposedControl:
        "Use encryption in transit and at rest, secrets management, and least-privilege permissions.",
      priority: "High",
    },
    {
      id: "RAI_03",
      category: "Transparency",
      consideration:
        "AI-assisted recommendations should not be presented as confirmed decisions.",
      proposedControl:
        "Clearly label AI-generated recommendations and expose supporting explanations where practical.",
      priority: "Medium",
    },
    {
      id: "RAI_04",
      category: "Human oversight",
      consideration:
        "Potentially consequential recommendations may require human review.",
      proposedControl:
        "Provide approval points and allow authorized users to override AI recommendations.",
      priority: "High",
    },
    {
      id: "RAI_05",
      category: "Reliability",
      consideration:
        "AI services may produce incorrect or unavailable results.",
      proposedControl:
        "Provide deterministic fallbacks, error handling, monitoring, and confidence thresholds where appropriate.",
      priority: "High",
    },
  ];

  const evaluationCriteria: AIEvaluationCriterion[] = [
    {
      id: "EVAL_01",
      name: "Classification Accuracy",
      description:
        "Measures how accurately service requests are categorized.",
      measurementApproach:
        "Evaluate against a reviewed dataset with known categories.",
      target: "Target to be agreed during discovery",
    },
    {
      id: "EVAL_02",
      name: "Recommendation Acceptance Rate",
      description:
        "Measures how often users accept AI routing recommendations.",
      measurementApproach:
        "Track accepted, rejected, and manually overridden recommendations.",
      target: "Target to be agreed during pilot",
    },
    {
      id: "EVAL_03",
      name: "Fallback Success Rate",
      description:
        "Measures whether the system continues operating when AI services fail.",
      measurementApproach:
        "Run failure scenarios and record successful deterministic fallbacks.",
      target: "Target to be agreed during testing",
    },
    {
      id: "EVAL_04",
      name: "Response Time",
      description:
        "Measures the time required to produce an AI-assisted result.",
      measurementApproach:
        "Capture latency across representative workloads.",
      target: "Target to be agreed during performance testing",
    },
  ];

  return {
    dataEntities,
    dataFlows,
    integrations,
    aiDecisionPoints,
    responsibleAIItems,
    evaluationCriteria,
    assumptions: [
      "The existing CRM remains the system of record for relevant customer information.",
      "The CRM API documentation will be provided during discovery.",
      "AI features are optional recommendations unless explicitly approved in scope.",
      "Data retention requirements require confirmation from the customer.",
    ],
    generatedAt: new Date().toISOString(),
    provider: "mock",
  };
}