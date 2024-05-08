from . import db
from .helper import generate_uuid

class Car(db.Model):
    __tablename__ = "car"

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    max_available_seats = db.Column(db.Integer, nullable=False)
    licence_plate = db.Column(db.String(20), nullable=False)

    driver = db.relationship("Driver", back_populates="car")


    def to_dict(self):
        return {
            "id": self.id,
            "max_available_seats": self.max_available_seats,
            "licence_plate": self.licence_plate,
        }
    
    
    def __repr__(self):
        return f"<Trip {self.id}>"

