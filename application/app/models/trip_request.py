from . import db
from .helper import generate_uuid, get_current_datetime, cast_datetime
from .states_types import TripRequestState
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape


class TripRequest(db.Model):
    __tablename__ = "trip_request"

    id = db.Column(db.String, primary_key=True, default=generate_uuid)

    pickup_location = db.Column(Geometry("POINT"), nullable=False) # LONG LAT FORMAT
    dropoff_location = db.Column(Geometry("POINT"), nullable=False)

    ## Added DateTime possibilities for a window of opportunities
    requested_time = db.Column(db.DateTime, nullable=False, default=get_current_datetime)
    window_start_time =  db.Column(db.DateTime, nullable=False)
    window_end_time =  db.Column(db.DateTime, nullable=False)

    status = db.Column(db.String, default=TripRequestState.PENDING)
    
    ## the below is useful for accessing the trip request being made by a passenger
    passenger = db.relationship("Passenger", back_populates="trip_requests")
    passenger_id = db.Column(db.String, db.ForeignKey("passenger.id"), nullable=False)

    trip = db.relationship("Trip", back_populates="trip_requests") ### Needs to link to a trip onces its been approved
    trip_id = db.Column(db.String, db.ForeignKey("trip.id")) # this instead since were indexing?


    def to_dict(self):
        start_point = to_shape(self.pickup_location)
        end_point = to_shape(self.dropoff_location)
        return {
            "id": self.id,
            "pickup_location": {"latitude": start_point.y, "longitude": start_point.x},
            "dropoff_location": {"latitude": end_point.y, "longitude": end_point.x},
            "requested_time": cast_datetime(self.requested_time),
            "window_start_time": cast_datetime(self.window_start_time),
            "window_end_time": cast_datetime(self.window_end_time),
            "status": self.status,
            "passenger_id": self.passenger_id,
            "trip_id": self.trip_id
        }


    def __repr__(self):
        return f"<TripRequest {self.id}>"
