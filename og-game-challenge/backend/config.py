class Config:
    SECRET_KEY = "dev-secret-key"
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
