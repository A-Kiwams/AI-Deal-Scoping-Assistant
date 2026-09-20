import type { ScopeModel } from "../types";
import { scopeModelSchema } from "./analysisSchema";
import { analyzeRequirementsWithMockAI } from "./mockAnalysisProvider";

export function analyzeRequirements(rawRequirements: string): ScopeModel {
  const result = analyzeRequirementsWithMockAI(rawRequirements);

  const validationResult = scopeModelSchema.safeParse(result);

  if (!validationResult.success) {
    console.error(
      "Analysis validation failed:",
      validationResult.error.flatten(),
    );

    throw new Error("The analysis engine returned an invalid scope model.");
  }

  return validationResult.data;
}
