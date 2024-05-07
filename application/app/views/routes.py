from flask import Blueprint, make_response, jsonify, request, render_template
from flask_restful import Api, Resource, marshal, reqparse 
from models import db
from models.car import Car
from models.driver import Driver
from models.passenger import Passenger
from models.trip_request import TripRequest
from models.trip import Trip
from datetime import datetime

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
                car_registration_number=args['car_registration_number'],
                car=new_car,
                car_id=new_car.id
            )
            db.session.add(new_driver)
            db.session.commit()

            return make_response(jsonify(new_driver.to_dict()), 201)

        except Exception as e:
            return make_response(str(e), 404)

class TripResource(Resource):
    def post(self):
        # Parse request data
        parser = reqparse.RequestParser()
        parser.add_argument('driver_id', type=str, required=True, help="Driver cannot be blank!")
        parser.add_argument('start_time', type=str, required=True, help="Start time cannot be blank!")
        parser.add_argument('end_time', type=str, required=True, help="End time cannot be blank!")
        parser.add_argument('start_location', type=dict, required=True, help="Start location cannot be blank!")
        parser.add_argument('end_location', type=dict, required=True, help="End location cannot be blank!")
        
        # Optional arguments
        parser.add_argument('status', type=str, required=False)
        parser.add_argument('seats_available', type=int, required=False)
        parser.add_argument('distance_addition', type=str, required=False)
        parser.add_argument('time_addition', type=str, required=False)
        args = parser.parse_args()

        # Assign parsed arguments to variables
        driver_id = args['driver_id']
        start_time = args['start_time']
        if start_time:
            start_time = datetime.strptime(start_time, '%Y-%m-%dT%H:%M:%SZ')
        end_time = args['end_time']
        end_time = datetime.strptime(end_time, '%Y-%m-%dT%H:%M:%SZ')
        start_location = args['start_location']
        end_location = args['end_location']
        status = args.get('status')  # Using .get() to handle optional arguments
        seats_available = args.get('seats_available')
        distance_addition = args.get('distance_addition')
        time_addition = args.get('time_addition')

        # If seats_available is not provided, fetch it from the associated car
        if seats_available is None:
            driver = Driver.query.get(driver_id)
            if not driver:
                return make_response({"error": "Driver not found"}, 404)

            car_id = driver.car_id
            if not car_id:
                return make_response({"error": "No car associated with the driver"}, 404)

            # Fetch seats_available from the associated car
            car = Car.query.get(car_id)

            if not car:
                return make_response({"error": "Car not found"}, 404)
            seats_available = car.max_available_seats

        # Check if either distance_addition or time_addition is provided
        if not distance_addition and not time_addition:
            return make_response({"error": "Either distance addition or time addition must be provided for the Trip"}, 400)

        # Create a new trip
        new_trip = Trip(
            driver_id=driver_id,
            start_time=start_time,
            end_time=end_time,
            start_location=start_location,
            end_location=end_location,
            status=status,
            seats_remaining=seats_available,
            distance_addition=distance_addition,
            time_addition=time_addition,
            driver=driver,
            created_at=datetime.utcnow()
        )
        db.session.add(new_trip)
        db.session.commit()
        return make_response(new_trip.to_dict(), 201)

    def get(self, trip_id):
        # Query the database for the trip with the given ID
        trip = Trip.query.get(trip_id)
        
        if trip:
            # If the trip is found, return its details
            return make_response(trip.to_dict(), 200)
        else:
            # If the trip is not found, return a 404 error
            return make_response({"error": "Trip not found"}, 404)

class TripRequestResource(Resource):
    def post(self):
        try:
            # Parse request data
            parser = reqparse.RequestParser()
            parser.add_argument('passenger_id', type=str, required=True, help="Passenger ID cannot be blank!")
            parser.add_argument('requested_time', type=str, required=True, help="Requested time cannot be blank!")
            parser.add_argument('pickup_location', type=dict, required=True, help="Pickup location cannot be blank!")
            parser.add_argument('dropoff_location', type=dict, required=True, help="Dropoff location cannot be blank!")
            parser.add_argument('pickup_window_start', type=str, required=True, help="Pickup window start cannot be blank!")
            parser.add_argument('pickup_window_end', type=str, required=True, help="Pickup window end cannot be blank!")
            args = parser.parse_args()

            # Extract parsed arguments
            passenger_id = args['passenger_id']
            requested_time = args['requested_time']
            pickup_location = args['pickup_location']
            dropoff_location = args['dropoff_location']
            pickup_window_start = args['pickup_window_start']
            pickup_window_end = args['pickup_window_end']
            
            # Convert string times to datetime objects
            pickup_window_start = datetime.strptime(pickup_window_start, '%Y-%m-%dT%H:%M:%S')
            pickup_window_end = datetime.strptime(pickup_window_end, '%Y-%m-%dT%H:%M:%S')

            # Create a new trip request object
            new_trip_request = TripRequest(
                passenger_id=passenger_id,
                requested_time=requested_time,
                pickup_location=pickup_location,
                dropoff_location=dropoff_location,
                pickup_window_start=pickup_window_start,
                pickup_window_end=pickup_window_end
            )

            # Add the new trip request to the database session and commit
            db.session.add(new_trip_request)
            db.session.commit()

            return make_response(new_trip_request.to_dict(), 201)
        except Exception as e:
            return make_response(str(e), 404)

    
    def get(self, trip_request_id=None):
        try:
            # Retrieve a specific trip request by its ID
            trip_request = TripRequest.query.get(trip_request_id)
            if trip_request:
                return make_response(trip_request.to_dict(), 200)
            else:
                return make_response({"error": "Trip request not found"}, 404)

            return make_response(trip_requests_data, 200)
        except Exception as e:
            return make_response(str(e), 404)

class PassengerListResource(Resource):
    def post(self):
        return PassengerResource().post()


api.add_resource(Health, "/health")
api.add_resource(PassengerResource, '/passengers/<string:passenger_id>')
api.add_resource(PassengerListResource, '/passengers')
api.add_resource(DriverResource, '/drivers', '/drivers/<string:driver_id>')
api.add_resource(TripResource, '/trip', '/trip/<string:trip_id>')
api.add_resource(TripRequestResource, '/trip-request','/trip_request/<string:trip_request_id>' )
