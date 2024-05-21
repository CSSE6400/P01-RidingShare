from app import create_app
flask_app = create_app()
celery_app = flask_app.extensions["celery"]

from models import db
from celery.signals import worker_process_init
@worker_process_init.connect
def prep_db_pool(**kwargs):
	with flask_app.app_context():
		db.engine.dispose(close=False)