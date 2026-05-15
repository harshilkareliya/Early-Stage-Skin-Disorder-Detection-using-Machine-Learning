# Early-Stage Skin Disorder Detection using Machine Learning

An ML-powered web application that predicts early-stage skin disorders using clinical parameters.  
The project includes Machine Learning model training, FastAPI backend, and React-based analytics dashboard.

---

## Features

- Predicts 6 skin disorder categories
- Clinical symptom-based prediction
- Interactive analytics dashboard
- Prediction history tracking
- Real-time confidence analysis

---

## Tech Stack

### Machine Learning
- Python
- Scikit-learn
- Pandas
- NumPy

### Backend
- FastAPI

### Frontend
- React
- TypeScript
- Vite

---

## Clinical Features Used

- Erythema
- Scaling
- Itching
- Definite Borders
- Polygonal Papules
- Oral Mucosal Involvement
- Scalp Involvement
- Knee & Elbow Involvement
- Age

---

## Models Trained

- Logistic Regression
- Decision Tree
- Random Forest
- Gaussian Naive Bayes
- Gradient Boosting
- SVC

---

## Final Model Performance

### Logistic Regression (Best Model)

| Metric | Score |
|---|---|
| Accuracy | 91.89% |
| Precision | 93.17% |
| Recall | 91.73% |
| F1 Score | 92.04% |

Hyperparameter tuning was performed using GridSearchCV with 5-fold cross-validation.

---

## Project Structure

```bash
backend/
frontend/
notebooks/
data/
```

### Dashboard Preview
* Prediction Analytics
* Class Distribution
* Confidence Tracking
* Recent Predictions


### Run Locally
**Backend**
1. cd backend
2. pip install -r requirements.txt
3. uvicorn main:app --reload

**Frontend**
1. cd frontend
2. npm install
3. npm run dev


### Author
***Harshil Kareliya***
