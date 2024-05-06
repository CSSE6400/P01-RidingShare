import datetime
from . import db
import uuid

class Trip(db.Model):
    __tablename__ = 'trip'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    driver_id = db.Column(db.String, db.ForeignKey('driver.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    start_location = db.Column(db.JSON, nullable=False)  # JSON for storing longitude and latitude
    end_location = db.Column(db.JSON, nullable=False)  # JSON for storing longitude and latitude
    status = db.Column(db.String, default="Matched")  # Matched, Ongoing, Completed, Cancelled
    seats_remaining = db.Column(db.Integer, nullable=False)
    
    ## the below is useful for accessing all trips being made by a driver 
    driver = db.relationship('Driver', backref=db.backref('trips', lazy=True))
    # car = None # HAVE THIS OR IN DRIVER?

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

