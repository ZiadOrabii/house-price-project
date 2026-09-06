from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes.prediction import router
from app.services.inference import load_model
from app.utils.logging_config import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    load_model()
    yield


app = FastAPI(title="House Price Prediction API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)