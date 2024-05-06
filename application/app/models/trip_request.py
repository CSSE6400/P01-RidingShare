import datetime
from . import db
import uuid

class TripRequest(db.Model):
    __tablename__ = 'trip_request'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    passenger_id = db.Column(db.String, db.ForeignKey('passenger.id'), nullable=False)
    requested_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    pickup_location = db.Column(db.JSON, nullable=False)
    dropoff_location = db.Column(db.JSON, nullable=False)

    ## Added DateTime possibilities for a window of opportunities
    pickup_window_start =  db.Column(db.DateTime, nullable=False)
    pickup_window_end =  db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String, default="Pending") # Options: Pending, Matched, Cancelled
    
    ## the below is useful for accessing the trip request being made by a passenger
    passenger = db.relationship('Passenger', backref=db.backref('trip_requests', lazy=True))
    

    def to_dict(self):
        return {
            'id': self.id,
            'passenger_id': self.passenger_id,
            'requested_time': self.requested_time.strftime('%Y-%m-%dT%H:%M:%SZ') if self.requested_time else None,
            'pickup_location': self.pickup_location,
            'dropoff_location': self.dropoff_location,
            'status': self.status
        }

    def write_preferences(seats_available=None, distance_addition=None, time_addition=None):
        return jsonify({'seats_available': seats_available, 'distance_addition': distance_addition, 'time_addition': time_addition})
        
    def __repr__(self):
        return f'<TripRequest {self.id}>'
