import type {
    EstimateAssumption, EstimateLineItem,
    EstimationModel,    ScopeModel,
    FunctionalScopeModel,
} from "../types";

export function generateEstimation( scopeModel : ScopeModel,
    functionalScope ? : FunctionalScopeModel ) : EstimationModel {
    const requirements = scopeModel . requirements;

    const findRequirementIds = ( types : string [] ) : string [] => {
            return requirements
          . filter( (requirement) => types . includes( requirement . type ) )
          . map( (requirement) => requirement . id );
    };

    const lineItems : EstimateLineItem [] = [
        {
            id: "EST_01",
            workstreamId : "WS_01",
            workstreamName : "Discovery & Solution Design",
            description :
"Detailed discovery, requirement clarification, solution design, and delivery planning.",
            role : "Solution Architect",
            effortHours : 80,
            hourlyRate : 75,
            subtotal : 80 * 75,
            requirementIds : requirements .
              map( (requirement) => requirement . id ),
            assumptions : [
                "Discovery workshops will be conducted remotely.",
"Customer stakeholders will be available for clarification sessions.",
            ],
        },
        {
            id: "EST_02",
            workstreamId : "WS_02",
            workstreamName : "Frontend Development",
            description :
"Responsive customer portal screens, account views, and service request interfaces.",
            role : "Frontend Developer",
            effortHours : 240,
            hourlyRate : 55,
            subtotal : 240 * 55,
            requirementIds : findRequirementIds(["FR", "NFR"]),
            assumptions : [
                "The customer will provide branding and design guidelines.",
                "The initial release will support the agreed core workflows.",
            ],
        },
        {
            id: "EST_03",
            workstreamId : "WS_03",
            workstreamName : "Backend & Business Logic",
            description :
"Backend services, account operations, service request workflows, and administrative functionality.",
            role : "Backend Developer",
            effortHours : 280,
            hourlyRate : 65,
            subtotal : 280 * 65,
            requirementIds : findRequirementIds(["FR", "SEC"]),
            assumptions : [
                "Business rules will be clarified during discovery.",
                "The CRM remains the system of record where applicable.",
            ],
        },
        {
            id: "EST_04",
            workstreamId : "WS_04",
            workstreamName : "CRM Integration",
            description :
"Integration with the existing CRM, error handling, synchronization, and integration testing.",
            role : "Integration Developer",
            effortHours : 160,
            hourlyRate : 70,
            subtotal : 160 * 70,
            requirementIds : findRequirementIds(["INT", "DATA"]),
            assumptions : [
                "CRM API documentation will be provided.",
                "The CRM supports the required integration operations.",
            ],
        },
        {
            id: "EST_05",
            workstreamId : "WS_05",
            workstreamName : "Quality Assurance",
            description :
"Functional testing, integration testing, regression testing, and acceptance-test support.",
            role : "QA Engineer",
            effortHours : 160,
            hourlyRate : 45,
            subtotal : 160 * 45,
            requirementIds : requirements .
              map( (requirement) => requirement . id ),
            assumptions : [
                "The customer will provide acceptance-test participants.", ],
        },
        {
            id: "EST_06",
            workstreamId : "WS_06",
            workstreamName : "Cloud & Deployment",
            description :
"Cloud environment configuration, deployment automation, monitoring, and release support.",
            role : "DevOps Engineer",
            effortHours : 120,
            hourlyRate : 70,
            subtotal : 120 * 70,
            requirementIds : findRequirementIds(["NFR", "SEC", "CONSTRAINT"]),
            assumptions : [
                "Required cloud subscriptions will be available.",
"Production access will be provided through approved processes.",
            ],
        },
    ];

    const subtotal = lineItems
      . reduce(
        ( total, item ) => total + item . subtotal,
        0
      );

    const contingencyPercentage = 15;
    const contingencyAmount     = subtotal * ( contingencyPercentage / 100 );
    const totalEstimate         = subtotal + contingencyAmount;

    const timelinePhases = [
        {
            id: "PHASE_01",
            name : "Discovery & Detailed Design",
            description :
"Clarify requirements, resolve open questions, and finalize the solution design.",
            durationWeeks : 3,
            dependencies : [],
            workstreamIds : ["WS_01"],
        },
        {
            id: "PHASE_02",
            name : "Core Application Development",
            description :
"Develop the customer portal, account functionality, and service request workflows.",
            durationWeeks : 8,
            dependencies : ["PHASE_01"],
            workstreamIds : [ "WS_02", "WS_03" ],
        },
        {
            id: "PHASE_03",
            name : "CRM Integration",
            description :
"Implement and validate CRM integration and synchronization processes.",
            durationWeeks : 4,
            dependencies : [ "PHASE_01", "PHASE_02" ],
            workstreamIds : ["WS_04"],
        },
        {
            id: "PHASE_04",
            name : "Testing & Stabilization",
            description :
"Perform functional, integration, security, and regression testing.",
            durationWeeks : 4,
            dependencies : [ "PHASE_02", "PHASE_03" ],
            workstreamIds : ["WS_05"],
        },
        {
            id: "PHASE_05",
            name : "Deployment & Handover",
            description :
"Complete production deployment, operational handover, and release activities.",
            durationWeeks : 2,
            dependencies : ["PHASE_04"],
            workstreamIds : ["WS_06"],
        },
    ];

    const assumptions : EstimateAssumption [] = [
        {
            id: "EST_ASSUMPTION_01",
            description :
"The six-month delivery constraint is treated as a planning target.",
            impact :
"Schedule compression or additional parallel resources may be required.",
            confirmed : false,
        },
        {
            id: "EST_ASSUMPTION_02",
            description :
              "The existing CRM has usable APIs for the required operations.",
            impact :
              "Unavailable or incomplete APIs may increase integration effort.",
            confirmed : false,
        },
        {
            id: "EST_ASSUMPTION_03",
            description :
"The estimate covers the currently identified core portal capabilities.",
            impact : "Additional capabilities will require change assessment.",
            confirmed : false,
        },
        {
            id: "EST_ASSUMPTION_04",
            description :
"Cloud infrastructure and third-party service charges are excluded.",
            impact : "Cloud operating costs should be estimated separately.",
            confirmed : false,
        },
    ];

    return {
        currency: "USD",
        lineItems,
        timelinePhases,
        assumptions,
        contingencyPercentage,
        subtotal,
        contingencyAmount,
        totalEstimate,
        totalHours : lineItems
          . reduce(
            ( total, item ) => total + item . effortHours,
            0
          ),
        estimatedDurationWeeks : 21,
        confidence : "Low",
        limitations : [
            "This is a mock ROM estimate, not a fixed-price quotation.",
            "The CRM API documentation has not yet been reviewed.",
"Resource availability and team composition have not been confirmed.",
"Cloud infrastructure costs and third-party licensing are excluded.",
            "Actual effort must be recalculated after detailed discovery.",
        ],
        generatedAt : new Date() . toISOString(),
        provider : "mock",
    };
}
