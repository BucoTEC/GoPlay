from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    app_name: str = "EHR CDS API"
    database_url: str = "sqlite:///./ehr_cds.db"
    csv_data_path: str = os.path.join(os.path.dirname(__file__), "med_data")
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
