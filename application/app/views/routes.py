from flask import Blueprint, make_response, jsonify, request, render_template
from flask_restful import Api, Resource, marshal, reqparse 
from models import db
from models.car import Car
from models.driver import Driver
from models.passenger import Passenger
from models.trip_request import TripRequest
from models.trip import Trip
from models.user import User
from datetime import datetime

from .helpers.args_parser import create_driver_parser, create_passenger_parser, get_user_parser, create_trip_parser
from .helpers.helpers import get_user_from_username, get_driver_id_from_username, get_driver_from_driver_id, check_for_conflicting_times

api_bp = Blueprint("api", __name__)
api = Api(api_bp)
class Health(Resource):
	def get(self):
		return make_response({"status": "ok"})

class PassengerResource(Resource):
    def post(self):
        try:
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
        except Exception as e:
            return make_response(str(e), 404)

    def get(self, passenger_id):
        passenger = Passenger.query.get(passenger_id)
        if passenger:
            return make_response(jsonify(passenger.to_dict()), 200)
        else:
            return make_response(jsonify({"error": "Passenger not found"}), 404)

class TripRequestResource(Resource):
    def post(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('passenger_id', type=str, required=True, help="Passenger ID cannot be blank!")
            parser.add_argument('requested_time', type=str, required=True, help="Requested time cannot be blank!")
            parser.add_argument('pickup_location', type=dict, required=True, help="Pickup location cannot be blank!")
            parser.add_argument('dropoff_location', type=dict, required=True, help="Dropoff location cannot be blank!")
            parser.add_argument('pickup_window_start', type=str, required=True, help="Pickup window start cannot be blank!")
            parser.add_argument('pickup_window_end', type=str, required=True, help="Pickup window end cannot be blank!")
            args = parser.parse_args()

            passenger_id = args['passenger_id']
            requested_time = args['requested_time']
            pickup_location = args['pickup_location']
            dropoff_location = args['dropoff_location']
            pickup_window_start = args['pickup_window_start']
            pickup_window_end = args['pickup_window_end']
            
            pickup_window_start = datetime.strptime(pickup_window_start, '%Y-%m-%dT%H:%M:%S')
            pickup_window_end = datetime.strptime(pickup_window_end, '%Y-%m-%dT%H:%M:%S')

            new_trip_request = TripRequest(
                passenger_id=passenger_id,
                requested_time=requested_time,
                pickup_location=f'Point({pickup_location.get("longitude")} {pickup_location.get("latitude")})',
                dropoff_location=f'Point({dropoff_location.get("longitude")} {dropoff_location.get("latitude")})',
                pickup_window_start=pickup_window_start,
                pickup_window_end=pickup_window_end
            )

            db.session.add(new_trip_request)
            db.session.commit()

            return make_response(new_trip_request.to_dict(), 201)
        except Exception as e:
            return make_response(str(e), 404)

    
    def get(self, trip_request_id=None):
        try:
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


class CreateDriver(Resource):

    def post(self):
        contents = create_driver_parser.parse_args()

        user = get_user_from_username(contents.get("username"))
        if user == None or user.driver == None:
            car = Car(
                max_available_seats = contents.get("max_available_seats"),
                licence_plate = contents.get("licence_plate")   
            )
            db.session.add(car)

            driver = Driver(
                car = car
            )
            db.session.add(driver)

            if user == None:
                user = User(
                    username = contents.get("username"),
                    email = contents.get("email"),
                    name = contents.get("name"),
                    phone_number = contents.get("phone_number"),
                )
                db.session.add(user)
            
            user.driver = driver
            db.session.commit()
            return make_response(user.to_dict(), 201)

        elif user.driver != None:
            return make_response("User account is already a driver", 202)

class CreatePassenger(Resource):

    def post(self):
        contents = create_passenger_parser.parse_args()
               
        user = get_user_from_username(contents.get("username"))
        if user == None or user.passenger == None:
            passenger = Passenger()
            db.session.add(passenger)

            if user == None:
                user = User(
                    username = contents.get("username"),
                    email = contents.get("email"),
                    name = contents.get("name"),
                    phone_number = contents.get("phone_number"),
                )
                db.session.add(user)
            
            user.passenger = passenger
            db.session.commit()
            return make_response(user.to_dict(), 201)

        elif user.passenger != None:
            return make_response("User account is already a passenger", 202)
    
class GetUser(Resource):
    def get(self):
        contents = get_user_parser.parse_args()
        user = get_user_from_username(contents.get("username"))
        if user == None:
            return make_response("That user does not exist")
        else:
            return make_response(user.to_dict())


class CreateTrip(Resource):
    def post(self):
        contents = create_trip_parser.parse_args()
        driver_id = get_driver_id_from_username(contents.get("username"))
        if not driver_id:
            return make_response("Invalid Driver! Please ensure the username is linked to a driver account.", 404)
        
        driver = get_driver_from_driver_id(driver_id)
        if not driver:
            return make_response("Invalid Driver! Please ensure the username is linked to a driver account.", 404)
        
        ## Check the driver does not have a conflicting schedule 
        conflicting = check_for_conflicting_times(driver_id, contents.get("start_time"), contents.get("end_time"))
        if conflicting:
            return make_response("Conflicting trips scheduled. Please remove the prior logged trip before requesting a trip.", 400)

        if contents.get("seats_available") is None:
            car = Car.query.get(driver.car_id)
            if not car:
                return make_response({"error": "No car associated with the driver"}, 404)

            seats_available = car.max_available_seats

        start_location = contents.get('start_location')
        end_location = contents.get('end_location')
        new_trip = Trip(
            start_time=contents.get("start_time"),
            end_time=contents.get("end_time"),
            start_location=f'Point({start_location.get("longitude")} {start_location.get("latitude")})',
            end_location=f'Point({end_location.get("longitude")} {end_location.get("latitude")})',
            seats_remaining=seats_available,
            distance_addition=contents.get("distance_addition"),
            driver=driver,
            driver_id=driver_id,
        )

        db.session.add(new_trip)
        db.session.commit()
        return make_response(new_trip.to_dict(), 201)

### Resources for methods that have POST and specific get methods ###
api.add_resource(Health, "/health")
api.add_resource(CreateDriver, "/driver/create")
api.add_resource(CreatePassenger, "/passenger/create")
api.add_resource(CreateTrip, "/trip/create")
api.add_resource(GetUser, "/profile")

### Specific Get methods for trips based on what is required ###
@api_bp.route("/trips/get/all")
def get_all_trips():
    contents = get_user_parser.parse_args()
    user = get_user_from_username(contents.get("username"))
    driver_id = get_driver_id_from_username(contents.get("username"))
    if driver_id:
        trips = db.session.execute(db.select(Trip).filter_by(driver_id=driver_id)).scalars().all()
        trips_data = [trip.to_dict() for trip in trips]
        return make_response({"trips": trips_data}, 200)
    else:
        return make_response("There is no driver under this username.", 400)

@api_bp.route("/trips/get/pending")
def get_pending_trips():
    contents = get_user_parser.parse_args()
    user = get_user_from_username(contents.get("username"))
    driver_id = get_driver_id_from_username(contents.get("username"))
    if driver_id:
        trips = db.session.execute(db.select(Trip).filter_by(driver_id=driver_id, status="PENDING")).scalars().all()
        trips_data = [trip.to_dict() for trip in trips]
        return make_response({"trips": trips_data}, 200)
    else:
        return make_response("There is no driver under this username.", 400)


# api.add_resource(TripRequestResource, '/trip-request','/trip_request/<string:trip_request_id>' )
