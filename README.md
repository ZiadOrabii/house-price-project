# House Price Prediction

End-to-end ML web app: data cleaning + model training in a Jupyter notebook, a FastAPI backend serving predictions from the exported scikit-learn pipeline, and a React + TypeScript frontend for user input and results.

## Overview

The app predicts Indian residential property prices from listing attributes (location, carpet area, floor, bathrooms, balconies, furnishing, transaction type, ownership, facing direction). The trained model is a scikit-learn `Pipeline` (preprocessing + regressor) exported with `joblib`, loaded once at FastAPI startup, and queried by the frontend form.


## Tech Stack

| Layer | Technology |
|---|---|
| Data & ML | Python, pandas, scikit-learn (`ColumnTransformer` + `Pipeline`), joblib, matplotlib/seaborn |
| Backend | FastAPI, Pydantic v2, `pydantic-settings`, Uvicorn, pytest |
| Frontend | React, TypeScript, Vite, `react-router-dom` |
| Dataset | [Kaggle: juhibhojani/house-price](https://www.kaggle.com/datasets/juhibhojani/house-price) |

## Project Structure

```
house-price-project/
├── notebooks/
│   ├── data/                       # raw CSV goes here (gitignored)
│   └── house_price_model.ipynb     # cleaning, EDA, training, export
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS, lifespan model loading
│   │   ├── api/routes/prediction.py
│   │   ├── core/config.py
│   │   ├── schemas/prediction.py
│   │   ├── services/{preprocessing,inference}.py
│   │   ├── utils/logging_config.py
│   │   └── models/
│   │       ├── house_price.pkl     # regenerated locally, see below
│   │       └── locations.json
│   ├── tests/test_prediction.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/predictionClient.ts
    │   ├── components/PredictionForm.tsx
    │   ├── pages/{HomePage,ResultPage,NotFoundPage}.tsx
    │   ├── types/prediction.ts
    │   └── App.tsx
    └── .env.example
```

## Dataset

Source: [Kaggle — House Price India](https://www.kaggle.com/datasets/juhibhojani/house-price).

```powershell
# Option A: manual download
# Download the CSV from the Kaggle page above and place it at notebooks/data/house_prices.csv

# Option B: Kaggle CLI
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

The raw CSV is not committed to this repo (large file) — download it before running the notebook.

## Model

`house_price.pkl` (~800MB) is **not committed** — it exceeds GitHub's practical size limits. Regenerate it locally:

```powershell
cd notebooks
jupyter notebook house_price_model.ipynb
# Kernel → Restart & Run All
```

This writes `house_price.pkl` and `locations.json` into both `notebooks/` and `backend/app/models/`.

### Model Metrics (test set)

| Model | MAE | RMSE | R² |
|---|---|---|---|
| LinearRegression | TODO | TODO | TODO |
| RandomForest | TODO | TODO | TODO |
| GradientBoosting | TODO | TODO | TODO |
| KNN | TODO | TODO | TODO |

**Winner:** RandomForest — *TODO: one-paragraph justification citing the numbers above.*

## Backend Setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for interactive Swagger UI.

### Backend Environment Variables

| Variable | Description | Default |
|---|---|---|
| `MODEL_PATH` | Path to the exported pipeline | `app/models/house_price.pkl` |
| `LOCATIONS_PATH` | Path to allowed locations list | `app/models/locations.json` |
| `CORS_ORIGINS` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |

### Run Tests

```powershell
python -m pytest
```

## Frontend Setup

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open `http://localhost:5173`.

### Frontend Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend base URL | `http://localhost:8000` |

## API Reference

### `GET /health`

```powershell
curl http://localhost:8000/health
```
```json
{"status": "ok"}
```

### `POST /predict`

```powershell
curl -X POST http://localhost:8000/predict `
  -H "Content-Type: application/json" `
  -d '{
    "location": "Sector 150 Noida",
    "carpet_area_sqft": 1200,
    "floor_num": 3,
    "bathroom": 2,
    "balcony": 1,
    "furnishing": "Furnished",
    "transaction": "New Property",
    "ownership": "Freehold",
    "facing": "East"
  }'
```

```json
{"predicted_price": 8500000.0}
```

Unrecognized `location` values are mapped to `"other"` server-side. Invalid input (e.g. `carpet_area_sqft <= 0`) returns `422`.

## Screenshots

*TODO: add screenshots of the home form and result page.*

| Home / Form | Result |
|---|---|
| ![Home](docs/screenshots/home.png) | ![Result](docs/screenshots/result.png) |

## Running the Full Stack

1. Backend: `cd backend && python -m uvicorn app.main:app --reload` (port 8000)
2. Frontend: `cd frontend && npm run dev` (port 5173)
3. Open `http://localhost:5173`, submit the form, confirm a predicted price appears on `/result`.

## Common Pitfalls

- **scikit-learn version mismatch** between the notebook's venv and `backend/requirements.txt` — pin both to the same version (`pip show scikit-learn`) or the `.pkl` may fail to load or predict incorrectly.
- **PowerShell**: use `;` not `&&` to chain commands (pre-v7); activate venvs with `.venv\Scripts\Activate.ps1`, not `source`.
- Don't commit `.env`, `node_modules/`, `.venv/`, the raw CSV, or `kaggle.json`.
