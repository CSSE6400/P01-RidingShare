from . import db
from .helper import generate_uuid, get_current_datetime, cast_datetime


class TripRequest(db.Model):
    __tablename__ = 'trip_request'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    passenger_id = db.Column(db.String, db.ForeignKey('passenger.id'), nullable=False)
    requested_time = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    pickup_location = db.Column(db.JSON, nullable=False)
    dropoff_location = db.Column(db.JSON, nullable=False)

    ## Added DateTime possibilities for a window of opportunities
    pickup_window_start =  db.Column(db.DateTime, nullable=False)
    pickup_window_end =  db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String, default="Pending") # Options: Pending, Matched, Cancelled
    
    ## the below is useful for accessing the trip request being made by a passenger
    passenger = db.relationship('Passenger', backref=db.backref('trip_requests', lazy=True))

    trip = None ### Needs to link to a trip onces its been approved
    trip_id = None # this instead since were indexing?

    def to_dict(self):
        return {
            'id': self.id,
            'passenger_id': self.passenger_id,
            'requested_time': cast_datetime(self.requested_time) if self.requested_time else None,
            'pickup_location': self.pickup_location,
            'dropoff_location': self.dropoff_location,
            'status': self.status
        }

    def __repr__(self):
        return f'<TripRequest {self.id}>'
