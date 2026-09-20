import { z } from "zod";

export const sourceReferenceSchema = z.object({
  sourceId: z.string(),
  text: z.string(),
  section: z.string().optional(),
  lineStart: z.number().optional(),
  lineEnd: z.number().optional(),
});

export const scopeRequirementSchema = z.object({
  id: z.string(),
  type: z.enum([
    "BR",
    "FR",
    "NFR",
    "INT",
    "DATA",
    "SEC",
    "CONSTRAINT",
    "DEPENDENCY",
  ]),
  description: z.string(),
  priority: z.enum(["High", "Medium", "Low", "Unassigned"]),
  origin: z.enum(["Customer-stated", "AI-inferred", "Assumed"]),
  sourceReferences: z.array(sourceReferenceSchema),
  dependencies: z.array(z.string()),
  openQuestions: z.array(z.string()),
});

export const scopeAssumptionSchema = z.object({
  id: z.string(),
  description: z.string(),
  reason: z.string(),
  status: z.enum(["Needs Review", "Accepted", "Rejected"]),
  relatedRequirementIds: z.array(z.string()),
});

export const clarificationQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  reason: z.string(),
  relatedRequirementIds: z.array(z.string()),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Open", "Answered"]),
});

export const scopeModelSchema = z.object({
  requirements: z.array(scopeRequirementSchema),
  assumptions: z.array(scopeAssumptionSchema),
  clarificationQuestions: z.array(clarificationQuestionSchema),
  analyzedAt: z.string(),
  provider: z.enum(["mock", "live"]),
});
