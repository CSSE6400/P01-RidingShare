import datetime
from . import db
import uuid

class Car(db.Model):
    __tablename__ = 'car'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    max_available_seats = db.Column(db.Integer, nullable=False)
    licence_plate = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<Trip {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'max_available_seats': self.max_available_seats,
            'licence_plate': self.licence_plate
        }

