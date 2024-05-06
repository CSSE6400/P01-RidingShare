from flask import Blueprint, make_response, jsonify, request, render_template
from flask_restful import Api, Resource, marshal, reqparse 
from models import db
from models.car import Car
from models.driver import Driver
from models.passenger import Passenger
from models.trip_request import TripRequest
from models.trip import Trip

api_bp = Blueprint("api", __name__)
api = Api(api_bp)

class Health(Resource):
	def get(self):
		return make_response({"status": "ok"})

class PassengerResource(Resource):
    def get(self, passenger_id):
        passenger = Passenger.query.get(passenger_id)
        if passenger:
            return make_response(jsonify(passenger.to_dict()), 200)
        else:
            return make_response(jsonify({"error": "Passenger not found"}), 404)

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help="Name cannot be blank!")
        parser.add_argument('phone_number', type=str, required=True, help="Phone number cannot be blank!")
        parser.add_argument('email', type=str, required=True, help="Email cannot be blank!")
        args = parser.parse_args()

        new_passenger = Passenger(
            name=args['name'],
            phone_number=args['phone_number'],
            email=args['email']
        )
        db.session.add(new_passenger)
        db.session.commit()

        return make_response(jsonify(new_passenger.to_dict()), 201)

class DriverResource(Resource):
    def get(self, driver_id):
        driver = Driver.query.get(driver_id)
        if driver:
            return make_response(jsonify(driver.to_dict()), 200)
        else:
            return make_response(jsonify({"error": "Driver not found"}), 404)

    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('name', type=str, required=True, help="Name cannot be blank!")
            parser.add_argument('phone_number', type=str, required=True, help="Phone number cannot be blank!")
            parser.add_argument('email', type=str, required=True, help="Email cannot be blank!")
            parser.add_argument('max_available_seats', type=int, required=True, help="Car seating number cannot be blank!")
            parser.add_argument('car_registration_number', type=str, required=True, help="Car registration number cannot be blank!")
            args = parser.parse_args()

            # Create a new car
            new_car = Car(
                max_available_seats=args['max_available_seats'],
                licence_plate=args['car_registration_number']
            )
            db.session.add(new_car)
            db.session.commit()
            # Create a new driver and associate the car with the driver
            new_driver = Driver(
                name=args['name'],
                phone_number=args['phone_number'],
                email=args['email'],
                car=new_car,
                car_id=new_car.id
            )
            db.session.add(new_driver)
            db.session.commit()

            return make_response(jsonify(new_driver.to_dict()), 201)

        except Exception as e:
            return make_response(str(e), 404)

class PassengerListResource(Resource):
    def post(self):
        return PassengerResource().post()


api.add_resource(Health, "/health")
api.add_resource(PassengerResource, '/passengers/<string:passenger_id>')
api.add_resource(PassengerListResource, '/passengers')
api.add_resource(DriverResource, '/drivers', '/drivers/<string:driver_id>')
