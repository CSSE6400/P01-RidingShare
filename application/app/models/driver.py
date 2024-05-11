from . import db
from .helper import generate_uuid

class Driver(db.Model):
    __tablename__ = "driver"

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    user = db.relationship("User", back_populates="driver")

    car = db.relationship("Car", back_populates="driver")
    car_id = db.Column(db.String, db.ForeignKey("car.id"))


    def to_dict(self):
        return {
            "id": self.id,
            "car_id": self.car_id
        }


    def __repr__(self):
        return f"<Driver {self.id}>"