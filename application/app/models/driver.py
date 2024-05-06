import datetime
from . import db
import uuid
from models.car import Car

class Driver(db.Model):
    __tablename__ = 'driver'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)
    car_registration_number = db.Column(db.String, nullable=False) # TODO maybe remove this and access it straight from the car?

    car = db.relationship('Car', backref='driver', uselist=False)
    car_id = db.Column(db.String, db.ForeignKey('car.id'))  # Foreign key to Car model

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email,
            'car_registration_number': self.car_registration_number,
        }

    def __repr__(self):
        return f'<Driver {self.id}>'