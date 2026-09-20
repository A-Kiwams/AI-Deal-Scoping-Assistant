import type {
  ArchitectureModel,
  ArchitectureComponent,
  ArchitectureConnection,
  CloudPlatform,
  ScopeModel,
} from "../types";

function getCloudServices(cloud: CloudPlatform) {
  switch (cloud) {
    case "AWS":
      return {
        frontend: "Amazon S3 + CloudFront",
        backend: "AWS Lambda + API Gateway",
        database: "Amazon Aurora",
        integration: "AWS AppFlow / API integration layer",
        security: "Amazon Cognito + AWS KMS",
        messaging: "Amazon SES + Amazon EventBridge",
        monitoring: "Amazon CloudWatch",
        storage: "Amazon S3",
      };

    case "Azure":
      return {
        frontend: "Azure Static Web Apps",
        backend: "Azure App Service",
        database: "Azure SQL Database",
        integration: "Azure API Management",
        security: "Microsoft Entra ID + Azure Key Vault",
        messaging: "Azure Communication Services / Service Bus",
        monitoring: "Azure Monitor + Application Insights",
        storage: "Azure Blob Storage",
      };

    case "GCP":
      return {
        frontend: "Firebase Hosting",
        backend: "Cloud Run",
        database: "Cloud SQL",
        integration: "Apigee API Management",
        security: "Identity Platform + Cloud KMS",
        messaging: "Pub/Sub",
        monitoring: "Cloud Monitoring",
        storage: "Cloud Storage",
      };

    default:
      return {
        frontend: "Cloud-hosted web application",
        backend: "Managed application runtime",
        database: "Managed relational database",
        integration: "API integration layer",
        security: "Managed identity and key-management services",
        messaging: "Managed messaging and notification services",
        monitoring: "Cloud monitoring platform",
        storage: "Managed object storage",
      };
  }
}

export function generateArchitecture(
  cloudPlatform: CloudPlatform,
  scopeModel: ScopeModel,
): ArchitectureModel {
  const services = getCloudServices(cloudPlatform);

  const components: ArchitectureComponent[] = [
    {
      id: "CMP_01",
      name: "Customer Web Portal",
      type: "Frontend",
      description: "Responsive web interface for customers and administrators.",
      cloudService: services.frontend,
      rationale:
        "Provides a managed hosting option for the responsive portal interface.",
      tradeoffs: [
        "Managed hosting reduces infrastructure administration.",
        "Some advanced runtime requirements may require a different hosting model.",
      ],
      requirementIds: ["FR_01", "FR_02", "FR_03", "FR_04", "NFR_03"],
    },
    {
      id: "CMP_02",
      name: "Application API",
      type: "Backend",
      description:
        "Backend APIs for authentication workflows, customer profiles, and service requests.",
      cloudService: services.backend,
      rationale:
        "Provides a managed runtime for business logic and API operations.",
      tradeoffs: [
        "Managed runtimes reduce operational work.",
        "Runtime limits and scaling characteristics must be validated.",
      ],
      requirementIds: ["FR_01", "FR_02", "FR_03", "FR_04"],
    },
    {
      id: "CMP_03",
      name: "Operational Database",
      type: "Database",
      description:
        "Stores portal-specific operational data and service-request information.",
      cloudService: services.database,
      rationale:
        "A managed relational database can support structured customer and service-request data.",
      tradeoffs: [
        "Relational design supports transactional consistency.",
        "Capacity, licensing, and integration requirements require further analysis.",
      ],
      requirementIds: ["FR_02", "FR_03", "NFR_01"],
    },
    {
      id: "CMP_04",
      name: "CRM Integration Layer",
      type: "Integration",
      description:
        "Coordinates communication between the portal and the existing CRM.",
      cloudService: services.integration,
      rationale:
        "An integration layer can centralize API policies, transformation, and monitoring.",
      tradeoffs: [
        "Centralized integration improves governance.",
        "The final design depends on the CRM's API capabilities and limitations.",
      ],
      requirementIds: ["INT_01", "FR_02", "FR_03"],
    },
    {
      id: "CMP_05",
      name: "Identity and Secrets Management",
      type: "Security",
      description:
        "Supports identity management, access control, and protection of sensitive configuration.",
      cloudService: services.security,
      rationale:
        "Managed identity and key-management capabilities can support secure access and data protection.",
      tradeoffs: [
        "Managed security services reduce custom security implementation.",
        "Configuration, compliance, and tenant decisions must be validated.",
      ],
      requirementIds: ["FR_01", "FR_04", "SEC_01"],
    },
    {
      id: "CMP_06",
      name: "Notifications and Messaging",
      type: "Messaging",
      description: "Processes service-request status notifications.",
      cloudService: services.messaging,
      rationale:
        "Managed messaging and notification services can support asynchronous processing.",
      tradeoffs: [
        "Asynchronous processing can improve resilience.",
        "Delivery guarantees and retry behavior must be designed.",
      ],
      requirementIds: ["FR_05"],
    },
    {
      id: "CMP_07",
      name: "Monitoring and Observability",
      type: "Monitoring",
      description:
        "Collects application logs, metrics, and operational telemetry.",
      cloudService: services.monitoring,
      rationale:
        "Centralized observability supports availability monitoring and troubleshooting.",
      tradeoffs: [
        "Centralized telemetry improves visibility.",
        "Retention, cost, and sensitive-data filtering must be configured.",
      ],
      requirementIds: ["NFR_02"],
    },
    {
      id: "CMP_08",
      name: "Object Storage",
      type: "Storage",
      description:
        "Provides optional storage for documents and other portal assets.",
      cloudService: services.storage,
      rationale:
        "Object storage may support future attachments or document-based workflows.",
      tradeoffs: [
        "Object storage is suitable for files and unstructured content.",
        "File-upload functionality is not currently confirmed as part of the scope.",
      ],
      requirementIds: [],
    },
  ];

  const connections: ArchitectureConnection[] = [
    {
      id: "CONN_01",
      sourceComponentId: "CMP_01",
      targetComponentId: "CMP_02",
      label: "HTTPS API calls",
    },
    {
      id: "CONN_02",
      sourceComponentId: "CMP_02",
      targetComponentId: "CMP_03",
      label: "Database access",
    },
    {
      id: "CONN_03",
      sourceComponentId: "CMP_02",
      targetComponentId: "CMP_04",
      label: "CRM API requests",
    },
    {
      id: "CONN_04",
      sourceComponentId: "CMP_02",
      targetComponentId: "CMP_05",
      label: "Authentication and secrets",
    },
    {
      id: "CONN_05",
      sourceComponentId: "CMP_02",
      targetComponentId: "CMP_06",
      label: "Notification events",
    },
    {
      id: "CONN_06",
      sourceComponentId: "CMP_02",
      targetComponentId: "CMP_07",
      label: "Logs and metrics",
    },
  ];

  return {
    cloudPlatform,
    components: components.map((component) => ({
      ...component,
      requirementIds: component.requirementIds.filter((id) =>
        scopeModel.requirements.some((requirement) => requirement.id === id),
      ),
    })),
    connections,
    assumptions: [
      "The existing CRM exposes APIs suitable for integration.",
      "The portal will use a managed relational database for portal-specific data.",
      "The selected cloud platform has not yet been approved by the customer.",
      "The architecture is a preliminary design and requires technical validation.",
    ],
    generatedAt: new Date().toISOString(),
    provider: "mock",
  };
}
