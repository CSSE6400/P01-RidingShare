from datetime import datetime, timezone
import uuid


def get_current_datetime() -> str:
	return datetime.now(timezone.utc)


def cast_datetime(date: datetime) -> str:
	return date.isoformat(timespec="seconds")


def generate_uuid() -> str:
	return str(uuid.uuid4()) 

