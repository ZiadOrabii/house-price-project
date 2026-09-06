import json
import pandas as pd

from app.core.config import settings
from app.schemas.prediction import PredictionRequest

with open(settings.locations_path) as f:
    ALLOWED_LOCATIONS = set(json.load(f))


def request_to_dataframe(req: PredictionRequest) -> pd.DataFrame:
    location = req.location if req.location in ALLOWED_LOCATIONS else "other"
    return pd.DataFrame([{
        "carpet_area_sqft": req.carpet_area_sqft,
        "floor_num": req.floor_num,
        "bathroom": req.bathroom,
        "balcony": req.balcony,
        "location_grouped": location,
        "Furnishing": req.furnishing,
        "Transaction": req.transaction,
        "Ownership": req.ownership,
        "facing": req.facing,
    }])