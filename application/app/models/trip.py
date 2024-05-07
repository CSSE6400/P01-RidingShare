from datetime import datetime, timezone
from . import db
import uuid
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape

def _get_current_datetime() -> str:
	return datetime.now(timezone.utc)


def _cast_datetime(date: datetime) -> str:
	return date.isoformat(timespec="seconds")


class Trip(db.Model):
    __tablename__ = 'trip'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    driver_id = db.Column(db.String, db.ForeignKey('driver.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    start_location = db.Column(Geometry("POINT"), nullable=False)
    end_location = db.Column(Geometry("POINT"), nullable=False)


    status = db.Column(db.String, default="Matched")  # Matched, Ongoing, Completed, Cancelled
    seats_remaining = db.Column(db.Integer, nullable=True)
    time_addition = db.Column(db.Integer, nullable=True)
    distance_addition = db.Column(db.Integer, nullable=True)
    driver = db.relationship('Driver', backref=db.backref('trips', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=_get_current_datetime)
        
    def __repr__(self):
        return f'<Trip {self.id}>'



    def to_dict(self):
        start_point = to_shape(self.start_location)
        end_point = to_shape(self.end_location)

        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'start_time': _cast_datetime(self.start_time),
            'end_time': _cast_datetime(self.end_time) if self.end_time else None,
            'start_location': {"latitude": start_point.y, "longitude": start_point.x},
            'end_location': {"latitude": end_point.y, "longitude": end_point.x},
            'status': self.status,
            'seats_remaining': self.seats_remaining,
            'created_at': _cast_datetime(self.created_at)
        }

