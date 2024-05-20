from . import db
from .helper import generate_uuid, get_current_datetime, cast_datetime
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from .states_types import TripState


class Trip(db.Model):
    __tablename__ = "trip"

    id = db.Column(db.String, primary_key=True, default=generate_uuid)

    created_at = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    start_time = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    end_time = db.Column(db.DateTime, nullable=True)
    
    start_location = db.Column(Geometry("POINT"), nullable=False) # LONG LAT FORMAT
    end_location = db.Column(Geometry("POINT"), nullable=False)
    start_address = db.Column(db.String, nullable=False)
    end_address = db.Column(db.String, nullable=False)

    status = db.Column(db.String, default=TripState.PENDING)  # Matched, Ongoing, Completed, Cancelled, Pending
    time_addition = db.Column(db.Integer, nullable=True)
    distance_addition = db.Column(db.Integer, nullable=True)

    driver = db.relationship("Driver", backref=db.backref("trip", lazy=True))
    driver_id = db.Column(db.String, db.ForeignKey("driver.id"), nullable=False)
    seats_remaining = db.Column(db.Integer, nullable=False)

    trip_requests = db.relationship("TripRequest", back_populates="trip")
        
    def __repr__(self):
        return f"<Trip {self.id}>"

    def to_dict(self):
        start_point = to_shape(self.start_location)
        end_point = to_shape(self.end_location)

        return {
            "id": self.id,
            "created_at": self.created_at,
            "start_time": cast_datetime(self.start_time),
            "end_time": cast_datetime(self.end_time),
            "start_location": {"latitude": start_point.y, "longitude": start_point.x},
            "end_location": {"latitude": end_point.y, "longitude": end_point.x},
            "start_address": self.start_address, 
            "end_address": self.end_address, 
            "status": self.status,
            "distance_addition": self.distance_addition,
            "driver_id": self.driver_id,
            "seats_remaining": self.seats_remaining
        }

