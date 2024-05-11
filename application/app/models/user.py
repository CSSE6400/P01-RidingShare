from . import db


class User(db.Model):
    __tablename__ = "user"
    
    username = db.Column(db.String, nullable=False, unique=True, primary_key=True)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String, nullable=False)

    driver = db.relationship("Driver", back_populates="user")
    driver_id = db.Column(db.String, db.ForeignKey("driver.id"))

    passenger = db.relationship("Passenger", back_populates="user")
    passenger_id = db.Column(db.String, db.ForeignKey("passenger.id"))


    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "phone_number": self.phone_number,
            "driver_id": self.driver_id,
            "passenger_id": self.passenger_id
        }
