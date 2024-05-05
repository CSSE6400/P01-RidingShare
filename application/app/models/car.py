import datetime
from . import db
import uuid

class Car(db.Model):
    __tablename__ = 'car'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    # max_available_seats = None
    # licence_plate = None
    

    def __repr__(self):
        return f'<Trip {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'driver_id': self.driver_id,
            'start_time': self.start_time.strftime('%Y-%m-%dT%H:%M:%SZ') if self.start_time else None,
            'end_time': self.end_time.strftime('%Y-%m-%dT%H:%M:%SZ') if self.end_time else None,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'status': self.status,
            'seats_remaining': self.seats_remaining,
            'created_at': self.created_at.strftime('%Y-%m-%dT%H:%M:%SZ') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ') if self.updated_at else None,
        }
