from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    jwt_secret: str
    jwt_expire_minutes: int = 120
    smtp_host: str = "mailpit"
    smtp_port: int = 1025
    mail_from: str = "EventLokal <no-reply@eventlokal.local>"
    public_base_url: str = "http://localhost:3000"


settings = Settings()
