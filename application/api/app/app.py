from os import environ
from flask import Flask


def create_app(config_overrides=None):
    app = Flask(__name__)

    # Configure app with database URI + overrides
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("SQLALCHEMY_DATABASE_URI", "postgresql:///spamoverflow")
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] =  {"pool_pre_ping":True}
    app.config.from_mapping(
        CELERY=dict(
            broker_url=environ.get("CELERY_BROKER_URL") ,
            default_queue=environ.get("CELERY_DEFAULT_QUEUE", "low_priority"),
            task_ignore_result=True,
            broker_connection_retry_on_startup=True,
        )
    )
    if config_overrides:
        app.config.update(config_overrides)
    app.config.from_prefixed_env()

    # Register the blueprints
    from views.routes import api_bp
    app.register_blueprint(api_bp)

    return app
