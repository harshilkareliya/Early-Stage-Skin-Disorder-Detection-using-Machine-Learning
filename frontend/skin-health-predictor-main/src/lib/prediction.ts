// Skin disorder classes
export const DISORDER_CLASSES: Record<number, { name: string; description: string; color: string }> = {
  0: {
    name: "Normal (No Disorder)",
    description: "The clinical inputs do not indicate a significant skin disorder. Regular dermatological check-ups are still recommended for preventive care.",
    color: "hsl(152, 60%, 40%)",
  },
  1: {
    name: "Psoriasis",
    description: "A chronic autoimmune condition that causes rapid skin cell buildup, leading to scaling on the skin's surface. Common symptoms include red patches with silvery scales, dry cracked skin, and itching.",
    color: "hsl(0, 72%, 51%)",
  },
  2: {
    name: "Seborrheic Dermatitis",
    description: "A common skin condition that mainly affects the scalp, causing scaly patches, red skin, and stubborn dandruff. It can also affect oily areas of the body such as the face and chest.",
    color: "hsl(25, 95%, 53%)",
  },
  3: {
    name: "Lichen Planus",
    description: "An inflammatory condition affecting skin and mucous membranes, characterized by purplish, flat-topped bumps that may be itchy. Can also affect the mouth, nails, and scalp.",
    color: "hsl(262, 60%, 50%)",
  },
  4: {
    name: "Pityriasis Rosea",
    description: "A relatively common skin condition that causes a temporary rash of raised red scaly patches. It typically starts with a single large patch (herald patch) followed by smaller patches.",
    color: "hsl(330, 65%, 50%)",
  },
  5: {
    name: "Chronic Dermatitis",
    description: "A long-term skin inflammation causing itchy, swollen, and cracked skin. Often related to allergies or irritants, it can significantly impact quality of life.",
    color: "hsl(210, 60%, 50%)",
  },
  6: {
    name: "Pityriasis Rubra Pilaris",
    description: "A rare skin disorder characterized by reddish-orange patches, scaling, and thickening of the skin. It can affect the entire body and may include nail changes.",
    color: "hsl(38, 92%, 50%)",
  },

};

export const CLINICAL_FEATURES = [
  { key: "erythema", label: "Erythema", description: "Redness of the skin" },
  { key: "scaling", label: "Scaling", description: "Flaking or peeling skin" },
  { key: "definite_borders", label: "Definite Borders", description: "Clear boundaries of affected area" },
  { key: "itching", label: "Itching", description: "Pruritus intensity" },
  { key: "koebner_phenomenon", label: "Koebner Phenomenon", description: "Lesions at trauma sites" },
  { key: "polygonal_papules", label: "Polygonal Papules", description: "Angular raised bumps" },
  { key: "follicular_papules", label: "Follicular Papules", description: "Bumps around hair follicles" },
  { key: "oral_mucosal_involvement", label: "Oral Mucosal Involvement", description: "Mouth/mucous membrane affected" },
  { key: "knee_and_elbow_involvement", label: "Knee & Elbow Involvement", description: "Joints area affected" },
  { key: "scalp_involvement", label: "Scalp Involvement", description: "Scalp area affected" },
] as const;

export interface PredictionInput {
  erythema: number;
  scaling: number;
  definite_borders: number;
  itching: number;
  koebner_phenomenon: number;
  polygonal_papules: number;
  follicular_papules: number;
  oral_mucosal_involvement: number;
  knee_and_elbow_involvement: number;
  scalp_involvement: number;
  age: number;
}

export interface PredictionResult {
  predicted_class: number;
  probability: number;
  timestamp: string;
  inputs: PredictionInput;
}

export function getPredictionHistory(): PredictionResult[] {
  return JSON.parse(localStorage.getItem("prediction_history") || "[]");
}

export function savePredictionToHistory(result: PredictionResult) {
  const history = JSON.parse(localStorage.getItem("prediction_history") || "[]");
  history.push(result);
  localStorage.setItem("prediction_history", JSON.stringify(history));
}
