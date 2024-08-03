import os
from dotenv import load_dotenv

load_dotenv() # loading environment variables


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'default_secret_key')
    SQLALLCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.environ.get('FRONTEND_URL')
    DEEPL_AUTH_KEY = os.environ.get('DEEPL_AUTH_KEY')


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('LOCAL_DATABASE_URI', 'sqlite:///development.db')
    DEBUG = True


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    DEBUG = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
