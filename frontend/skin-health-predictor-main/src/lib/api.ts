import { z } from "zod";
import type { PredictionInput } from "./prediction";

const clinicalFieldSchema = z.number().int().min(0).max(4);

const predictionInputSchema = z.object({
  erythema: clinicalFieldSchema,
  scaling: clinicalFieldSchema,
  definite_borders: clinicalFieldSchema,
  itching: clinicalFieldSchema,
  koebner_phenomenon: clinicalFieldSchema,
  polygonal_papules: clinicalFieldSchema,
  follicular_papules: clinicalFieldSchema,
  oral_mucosal_involvement: clinicalFieldSchema,
  knee_and_elbow_involvement: clinicalFieldSchema,
  scalp_involvement: clinicalFieldSchema,
  age: z.number().int().min(1).max(120),
});

const apiResponseSchema = z.object({
  disease: z.string(),
  confidence: z.number().min(0).max(100),
});

export interface ApiPredictionResult {
  disease: string;
  confidence: number;
  message?: string;
  isHealthy: boolean;
}

const API_URL = "http://localhost:8000/predict";

function getClinicalScore(input: PredictionInput): number {
  return (
    input.erythema +
    input.scaling +
    input.definite_borders +
    input.itching +
    input.koebner_phenomenon +
    input.polygonal_papules +
    input.follicular_papules +
    input.oral_mucosal_involvement +
    input.knee_and_elbow_involvement +
    input.scalp_involvement
  );
}

export async function predictDisorder(input: PredictionInput): Promise<ApiPredictionResult> {
  // Validate input
  predictionInputSchema.parse(input);

  const clinicalScore = getClinicalScore(input);

  // If score <= 2, skip API call
  if (clinicalScore <= 2) {
    return {
      disease: "Healthy / Normal - No Skin Disorder",
      confidence: 100,
      isHealthy: true,
    };
  }

  // Call the backend API
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const result = apiResponseSchema.parse(data);

  // If confidence < 60%, override
  if (result.confidence < 60) {
    return {
      disease: "Healthy / Normal - No Skin Disorder",
      confidence: result.confidence,
      message: "Model confidence is too low to confirm a disorder.",
      isHealthy: true,
    };
  }

  return {
    disease: result.disease,
    confidence: result.confidence,
    isHealthy: false,
  };
}
