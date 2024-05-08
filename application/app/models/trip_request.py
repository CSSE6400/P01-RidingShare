from . import db
from .helper import generate_uuid, get_current_datetime, cast_datetime
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape

class TripRequest(db.Model):
    __tablename__ = 'trip_request'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    passenger_id = db.Column(db.String, db.ForeignKey('passenger.id'), nullable=False)
    requested_time = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    pickup_location = db.Column(Geometry("POINT"), nullable=False) # LONG LAT FORMAT
    dropoff_location = db.Column(Geometry("POINT"), nullable=False)

    ## Added DateTime possibilities for a window of opportunities
    pickup_window_start =  db.Column(db.DateTime, nullable=False)
    pickup_window_end =  db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String, default="Pending") # Options: Pending, Matched, Cancelled
    
    ## the below is useful for accessing the trip request being made by a passenger
    passenger = db.relationship('Passenger', backref=db.backref('trip_requests', lazy=True))

    trip = None ### Needs to link to a trip onces its been approved
    trip_id = None # this instead since were indexing?

    def to_dict(self):
        start_point = to_shape(self.pickup_location)
        end_point = to_shape(self.dropoff_location)
        return {
            'id': self.id,
            'passenger_id': self.passenger_id,
            'requested_time': cast_datetime(self.requested_time) if self.requested_time else None,
            'pickup_location': {"latitude": start_point.y, "longitude": start_point.x},
            'dropoff_location': {"latitude": end_point.y, "longitude": end_point.x},
            'status': self.status
        }

    def __repr__(self):
        return f'<TripRequest {self.id}>'
