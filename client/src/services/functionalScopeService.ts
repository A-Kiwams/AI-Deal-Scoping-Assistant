import type {
  FunctionalScopeModel,
  ScopeModel,
  ScopeCapability,
  ScopeModule,
  ScopeWorkstream,
  DeliveryPackage,
  OutOfScopeItem,
} from "../types";

export function generateFunctionalScope(
  scopeModel: ScopeModel,
): FunctionalScopeModel {
  const capabilities: ScopeCapability[] = [
    {
      id: "CAP_01",
      name: "Customer Account Management",
      description:
        "Support customer registration, secure access, and account information viewing.",
      origin: "Customer-requested",
      requirementIds: ["FR_01", "FR_02"],
    },
    {
      id: "CAP_02",
      name: "Service Request Management",
      description: "Allow customers to submit and track service requests.",
      origin: "Customer-requested",
      requirementIds: ["FR_03"],
    },
    {
      id: "CAP_03",
      name: "Administrative Management",
      description:
        "Provide administrative functionality for managing customer accounts.",
      origin: "Customer-requested",
      requirementIds: ["FR_04"],
    },
    {
      id: "CAP_04",
      name: "Customer Notifications",
      description:
        "Notify customers when the status of a service request changes.",
      origin: "Customer-requested",
      requirementIds: ["FR_05"],
    },
    {
      id: "CAP_05",
      name: "Portal Security and Compliance",
      description: "Provide appropriate protection for customer information.",
      origin: "AI-recommended",
      requirementIds: ["SEC_01"],
    },
  ];

  const modules: ScopeModule[] = [
    {
      id: "MOD_01",
      name: "Identity and Access",
      description:
        "Registration, login, identity management, and access control.",
      capabilityIds: ["CAP_01", "CAP_03"],
      requirementIds: ["FR_01", "FR_04", "SEC_01"],
    },
    {
      id: "MOD_02",
      name: "Customer Profile",
      description: "Customer account information and profile display.",
      capabilityIds: ["CAP_01"],
      requirementIds: ["FR_02"],
    },
    {
      id: "MOD_03",
      name: "Service Requests",
      description:
        "Service-request submission, tracking, and status management.",
      capabilityIds: ["CAP_02"],
      requirementIds: ["FR_03"],
    },
    {
      id: "MOD_04",
      name: "CRM Integration",
      description: "Integration layer for communication with the existing CRM.",
      capabilityIds: ["CAP_01", "CAP_02"],
      requirementIds: ["INT_01"],
    },
    {
      id: "MOD_05",
      name: "Notification Services",
      description: "Email notification processing and delivery.",
      capabilityIds: ["CAP_04"],
      requirementIds: ["FR_05"],
    },
  ];

  const workstreams: ScopeWorkstream[] = [
    {
      id: "WS_01",
      name: "Frontend Application",
      description: "Responsive customer and administrative portal interfaces.",
      moduleIds: ["MOD_01", "MOD_02", "MOD_03"],
      requirementIds: ["FR_01", "FR_02", "FR_03", "FR_04"],
    },
    {
      id: "WS_02",
      name: "Backend Services",
      description:
        "Business logic, APIs, access control, and service-request processing.",
      moduleIds: ["MOD_01", "MOD_02", "MOD_03"],
      requirementIds: ["FR_01", "FR_02", "FR_03", "FR_04"],
    },
    {
      id: "WS_03",
      name: "Integration and Notifications",
      description: "CRM integration and customer notification capabilities.",
      moduleIds: ["MOD_04", "MOD_05"],
      requirementIds: ["INT_01", "FR_05"],
    },
    {
      id: "WS_04",
      name: "Security and Quality Engineering",
      description:
        "Security controls, performance testing, and availability validation.",
      moduleIds: ["MOD_01"],
      requirementIds: ["SEC_01", "NFR_01", "NFR_02", "NFR_03"],
    },
  ];

  const deliveryPackages: DeliveryPackage[] = [
    {
      id: "PKG_01",
      name: "Portal Foundation",
      description:
        "Initial portal structure, identity, and customer profile functionality.",
      workstreamIds: ["WS_01", "WS_02"],
      requirementIds: ["FR_01", "FR_02"],
    },
    {
      id: "PKG_02",
      name: "Service Request Experience",
      description: "Service-request submission and management capabilities.",
      workstreamIds: ["WS_01", "WS_02"],
      requirementIds: ["FR_03", "FR_04"],
    },
    {
      id: "PKG_03",
      name: "Enterprise Integration",
      description: "CRM connectivity and email notification capabilities.",
      workstreamIds: ["WS_03"],
      requirementIds: ["INT_01", "FR_05"],
    },
    {
      id: "PKG_04",
      name: "Production Readiness",
      description:
        "Security, performance, availability, and responsive-design validation.",
      workstreamIds: ["WS_04"],
      requirementIds: ["SEC_01", "NFR_01", "NFR_02", "NFR_03"],
    },
  ];

  const outOfScopeItems: OutOfScopeItem[] = [
    {
      id: "OOS_01",
      description: "CRM replacement or migration to a new CRM platform.",
      reason: "The customer explicitly wants to retain the existing CRM.",
      relatedRequirementIds: ["INT_01"],
    },
    {
      id: "OOS_02",
      description: "Native mobile applications for Android and iOS.",
      reason:
        "The requirements mention responsive web access but do not request native mobile applications.",
      relatedRequirementIds: ["NFR_03"],
    },
    {
      id: "OOS_03",
      description: "Advanced analytics and business intelligence dashboards.",
      reason:
        "No analytics or business intelligence requirements were explicitly provided.",
      relatedRequirementIds: [],
    },
  ];

  // Remove references to requirements that do not exist
  // in the current reviewed scope model.
  const validRequirementIds = new Set(
    scopeModel.requirements.map((requirement) => requirement.id),
  );

  const filterRequirementIds = (ids: string[]) =>
    ids.filter((id) => validRequirementIds.has(id));

  return {
    capabilities: capabilities.map((capability) => ({
      ...capability,
      requirementIds: filterRequirementIds(capability.requirementIds),
    })),

    modules: modules.map((module) => ({
      ...module,
      requirementIds: filterRequirementIds(module.requirementIds),
    })),

    workstreams: workstreams.map((workstream) => ({
      ...workstream,
      requirementIds: filterRequirementIds(workstream.requirementIds),
    })),

    deliveryPackages: deliveryPackages.map((deliveryPackage) => ({
      ...deliveryPackage,
      requirementIds: filterRequirementIds(deliveryPackage.requirementIds),
    })),

    outOfScopeItems,

    generatedAt: new Date().toISOString(),
    provider: "mock",
  };
}
