import type {
  ScopeModel,
  ScopeRequirement,
  ScopeAssumption,
  ClarificationQuestion,
} from "../types";

function createSourceReference(
  sourceId: string,
  text: string,
  section?: string,
) {
  return {
    sourceId,
    text,
    section,
  };
}

export function analyzeRequirementsWithMockAI(
  rawRequirements: string,
): ScopeModel {
  const requirements: ScopeRequirement[] = [];
  const assumptions: ScopeAssumption[] = [];
  const clarificationQuestions: ClarificationQuestion[] = [];

  const lines = rawRequirements
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const addRequirement = (requirement: ScopeRequirement) => {
    requirements.push(requirement);
  };

  const findLine = (keyword: string) => {
    return lines.find((line) =>
      line.toLowerCase().includes(keyword.toLowerCase()),
    );
  };

  const registrationLine = findLine("register and log in");

  if (registrationLine) {
    addRequirement({
      id: "FR_01",
      type: "FR",
      description:
        "Customers must be able to register and securely log in to the customer portal.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_01",
          registrationLine,
          "Functional Requirements",
        ),
      ],
      dependencies: ["SEC_01"],
      openQuestions: [
        "What authentication mechanism should be used?",
        "Is multi-factor authentication required?",
      ],
    });
  }

  const accountLine = findLine("view their account information");

  if (accountLine) {
    addRequirement({
      id: "FR_02",
      type: "FR",
      description: "Customers must be able to view their account information.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference("SRC_02", accountLine, "Functional Requirements"),
      ],
      dependencies: ["INT_01", "DATA_01"],
      openQuestions: [
        "Which account information should be displayed?",
        "Should customers be allowed to update their information?",
      ],
    });
  }

  const serviceRequestLine = findLine("submit service requests");

  if (serviceRequestLine) {
    addRequirement({
      id: "FR_03",
      type: "FR",
      description:
        "Customers must be able to submit service requests through the portal.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_03",
          serviceRequestLine,
          "Functional Requirements",
        ),
      ],
      dependencies: ["DATA_01"],
      openQuestions: [
        "What types of service requests should be supported?",
        "Should customers be able to attach files?",
      ],
    });
  }

  const adminLine = findLine("manage customer accounts");

  if (adminLine) {
    addRequirement({
      id: "FR_04",
      type: "FR",
      description: "Administrators must be able to manage customer accounts.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference("SRC_04", adminLine, "Functional Requirements"),
      ],
      dependencies: ["SEC_01"],
      openQuestions: [
        "Which administrative roles are required?",
        "Should administrative actions be audited?",
      ],
    });
  }

  const crmLine = findLine("existing CRM");

  if (crmLine) {
    addRequirement({
      id: "INT_01",
      type: "INT",
      description:
        "The customer portal must integrate with the existing CRM system.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference("SRC_05", crmLine, "Technical Preferences"),
      ],
      dependencies: [],
      openQuestions: [
        "Which CRM platform is currently in use?",
        "What integration protocols are supported?",
        "When will the CRM API documentation be available?",
      ],
    });
  }

  const notificationLine = findLine("email notifications");

  if (notificationLine) {
    addRequirement({
      id: "FR_05",
      type: "FR",
      description:
        "Customers should receive email notifications when service request statuses change.",
      priority: "Medium",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_06",
          notificationLine,
          "Functional Requirements",
        ),
      ],
      dependencies: ["INT_01"],
      openQuestions: [
        "Which email provider should be used?",
        "Can customers opt out of notifications?",
      ],
    });
  }

  const customerLimitLine = findLine("50,000");

  if (customerLimitLine) {
    addRequirement({
      id: "NFR_01",
      type: "NFR",
      description:
        "The application should support up to 50,000 registered customers.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_07",
          customerLimitLine,
          "Non-Functional Requirements",
        ),
      ],
      dependencies: [],
      openQuestions: ["What is the expected peak number of concurrent users?"],
    });
  }

  const availabilityLine = findLine("99.9%");

  if (availabilityLine) {
    addRequirement({
      id: "NFR_02",
      type: "NFR",
      description: "The application should provide 99.9% availability.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_08",
          availabilityLine,
          "Non-Functional Requirements",
        ),
      ],
      dependencies: [],
      openQuestions: [
        "Does the availability target apply to the entire system?",
        "Are planned maintenance windows excluded?",
      ],
    });
  }

  const encryptionLine = findLine("encrypted");

  if (encryptionLine) {
    addRequirement({
      id: "SEC_01",
      type: "SEC",
      description:
        "Customer information must be encrypted in transit and at rest.",
      priority: "High",
      origin: "AI-inferred",
      sourceReferences: [
        createSourceReference(
          "SRC_09",
          encryptionLine,
          "Non-Functional Requirements",
        ),
      ],
      dependencies: [],
      openQuestions: [
        "Are there specific regulatory or industry security requirements?",
        "Are customer-managed encryption keys required?",
      ],
    });
  }

  const responsiveLine = findLine("responsive");

  if (responsiveLine) {
    addRequirement({
      id: "NFR_03",
      type: "NFR",
      description:
        "The application should be responsive on mobile and desktop devices.",
      priority: "Medium",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference(
          "SRC_10",
          responsiveLine,
          "Non-Functional Requirements",
        ),
      ],
      dependencies: [],
      openQuestions: [
        "Which browsers and mobile operating systems must be supported?",
      ],
    });
  }

  const deliveryLine = findLine("six months");

  if (deliveryLine) {
    addRequirement({
      id: "CON_01",
      type: "CONSTRAINT",
      description: "The solution must be delivered within six months.",
      priority: "High",
      origin: "Customer-stated",
      sourceReferences: [
        createSourceReference("SRC_11", deliveryLine, "Constraints"),
      ],
      dependencies: [],
      openQuestions: ["Is the six-month deadline fixed or negotiable?"],
    });
  }

  assumptions.push({
    id: "ASM_01",
    description:
      "The existing CRM will remain the system of record for relevant customer information.",
    reason:
      "The customer explicitly requested that the existing CRM be retained.",
    status: "Needs Review",
    relatedRequirementIds: ["INT_01", "FR_02"],
  });

  assumptions.push({
    id: "ASM_02",
    description:
      "The customer will provide CRM API documentation before integration development begins.",
    reason:
      "The requirements indicate that CRM API documentation has not yet been provided.",
    status: "Needs Review",
    relatedRequirementIds: ["INT_01"],
  });

  clarificationQuestions.push({
    id: "Q_01",
    question: "Which CRM platform is currently used by the customer?",
    reason:
      "The CRM platform is necessary to determine the integration approach and effort.",
    relatedRequirementIds: ["INT_01"],
    priority: "High",
    status: "Open",
  });

  clarificationQuestions.push({
    id: "Q_02",
    question: "What authentication and identity provider should be used?",
    reason:
      "Secure registration and login are required, but the identity approach is unspecified.",
    relatedRequirementIds: ["FR_01", "SEC_01"],
    priority: "High",
    status: "Open",
  });

  clarificationQuestions.push({
    id: "Q_03",
    question: "What are the expected peak concurrent users?",
    reason:
      "The registered-user count does not establish the required capacity or performance profile.",
    relatedRequirementIds: ["NFR_01"],
    priority: "Medium",
    status: "Open",
  });

  return {
    requirements,
    assumptions,
    clarificationQuestions,
    analyzedAt: new Date().toISOString(),
    provider: "mock",
  };
}
