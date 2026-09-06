import joblib

from app.core.config import settings

_model = None


def load_model():
    global _model
    _model = joblib.load(settings.model_path)
    return _model


def get_model():
    if _model is None:
        raise RuntimeError("Model not loaded. Call load_model() at startup.")
    return _model


def predict(df) -> float:
    model = get_model()
    return float(model.predict(df)[0])