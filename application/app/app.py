from os import environ
import os
from flask import Flask, send_from_directory


def create_app(config_overrides=None):
    app = Flask(__name__, static_folder='frontend/build')

    # Configure app with database URI + overrides
    app.config['SQLALCHEMY_DATABASE_URI'] = environ.get("SQLALCHEMY_DATABASE_URI", "postgresql+psycopg:///ridingshare")
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] =  {"pool_pre_ping": True}
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
    from models.car import Car
    from models.driver import Driver
    from models.trip import Trip
    from models.user import User
    db.init_app(app)

    # Create the database tables
    with app.app_context():
        db.create_all()
        db.session.commit()

    # Register the blueprints
    from views.routes import api_bp
    app.register_blueprint(api_bp)

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    
    return app