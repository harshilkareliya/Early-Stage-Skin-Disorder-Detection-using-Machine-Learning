from fastapi import FastAPI
from pydantic import BaseModel
# from predict import predict_skin_disease
from backend.predict import predict_skin_disease
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SkinInput(BaseModel):
    erythema: int
    scaling: int
    definite_borders: int
    itching: int
    koebner_phenomenon: int
    polygonal_papules: int
    follicular_papules: int
    oral_mucosal_involvement: int
    knee_and_elbow_involvement: int
    scalp_involvement: int
    age: int


@app.get("/")
def home():
    return {"message": "Skin Disorder Detection API Running"}


@app.post("/predict")
def predict(data: SkinInput):
    print("Received data:", data)
    features = [
        data.erythema,
        data.scaling,
        data.definite_borders,
        data.itching,
        data.koebner_phenomenon,
        data.polygonal_papules,
        data.follicular_papules,
        data.oral_mucosal_involvement,
        data.knee_and_elbow_involvement,
        data.scalp_involvement,
        data.age
    ]

    result = predict_skin_disease(features)

    return result