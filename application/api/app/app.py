from os import environ
from flask import Flask


def create_app(config_overrides=None):
    app = Flask(__name__)

    # Configure app with database URI + overrides
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("SQLALCHEMY_DATABASE_URI", "postgresql:///ridingshare")
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

    from models import db
    from models.passenger import Passenger
    from models.trip_request import TripRequest
    from models.driver import Driver
    from models.trip import Trip
    db.init_app(app)

    # Create the database tables
    with app.app_context():
        db.create_all()
        db.session.commit()

    # Register the blueprints
    from views.routes import api_bp
    app.register_blueprint(api_bp)

    return app
