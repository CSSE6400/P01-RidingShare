from celery import shared_task 
from models import db


@shared_task(ignore_result=True, retry=3, max_retries=5, retry_backoff=True, retry_jitter=True)
def run_trip_matching() -> None:
	pass


@shared_task(ignore_result=True, retry=3, max_retries=5, retry_backoff=True, retry_jitter=True)
def run_request_matching() -> None:
	pass