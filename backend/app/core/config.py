from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_path: str = "app/models/house_price.pkl"
    locations_path: str = "app/models/locations.json"
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()