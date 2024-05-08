from . import db
from .helper import generate_uuid, get_current_datetime, cast_datetime
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape



class Trip(db.Model):
    __tablename__ = 'trip'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    driver_id = db.Column(db.String, db.ForeignKey('driver.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    end_time = db.Column(db.DateTime, nullable=True)
    start_location = db.Column(Geometry("POINT"), nullable=False) # LONG LAT FORMAT
    end_location = db.Column(Geometry("POINT"), nullable=False)

    status = db.Column(db.String, default="Matched")  # Matched, Ongoing, Completed, Cancelled, Pending
    seats_remaining = db.Column(db.Integer, nullable=True)
    time_addition = db.Column(db.Integer, nullable=True)
    distance_addition = db.Column(db.Integer, nullable=True)
    driver = db.relationship('Driver', backref=db.backref('trips', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=get_current_datetime)

    requests_added = None # list of all the trip_requests that are taking this trip
        
    def __repr__(self):
        return f'<Trip {self.id}>'



    def to_dict(self):
        start_point = to_shape(self.start_location)
        end_point = to_shape(self.end_location)

        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'start_time': cast_datetime(self.start_time),
            'end_time': cast_datetime(self.end_time) if self.end_time else None,
            'start_location': {"latitude": start_point.y, "longitude": start_point.x},
            'end_location': {"latitude": end_point.y, "longitude": end_point.x},
            'status': self.status,
            'seats_remaining': self.seats_remaining,
            'created_at': cast_datetime(self.created_at)
        }

