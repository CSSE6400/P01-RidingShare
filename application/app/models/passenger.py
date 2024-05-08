from . import db
from .helper import generate_uuid


class Passenger(db.Model):
    __tablename__ = 'passenger'

    id = db.Column(db.String, primary_key=True, default=generate_uuid)
    email = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'email': self.email
        }

    def __repr__(self):
        return f'<Passenger {self.id}>'
