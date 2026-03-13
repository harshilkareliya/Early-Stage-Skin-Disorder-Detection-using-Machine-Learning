import os
import joblib
import numpy as np

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Build full model path
MODEL_PATH = os.path.join(BASE_DIR, "model", "skin_disease_model.pkl")

# Load model
model = joblib.load(MODEL_PATH)
# Load model once when server starts

# Map class numbers to disease names
class_names = {
    1: "Psoriasis",
    2: "Seborrheic Dermatitis",
    3: "Lichen Planus",
    4: "Pityriasis Rosea",
    5: "Chronic Dermatitis",
    6: "Pityriasis Rubra Pilaris"
}


def predict_skin_disease(features):

    # convert input to numpy array
    X = np.array(features).reshape(1, -1)

    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]
    print(f"Probabilities: {probabilities}")
    confidence = float(np.max(probabilities)) * 100
    print(f"Predicted class: {[int(prediction)]}, Confidence: {confidence:.2f}%")
    return {
        "disease": class_names[int(prediction)],
        "confidence": round(confidence, 2)
    }