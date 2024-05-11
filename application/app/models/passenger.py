from . import db
from .helper import generate_uuid


class Passenger(db.Model):
    __tablename__ = "passenger"

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user = db.relationship("User", back_populates="passenger")

    trip_requests = db.relationship("TripRequest", back_populates="passenger")


    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user,
            "trip_requests": self.trip_requests
        }


    def __repr__(self):
        return f"<Passenger {self.id}>"
