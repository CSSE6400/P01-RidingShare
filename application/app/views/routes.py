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
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from sqlalchemy import update
from models.states_types import TripRequestState


from .helpers.args_parser import create_driver_parser, create_passenger_parser, get_user_parser, create_trip_parser, create_trip_request_parser, get_user_details_parser, nearby_trip_requests_parser, approve_requests_parser
from .helpers.helpers import *

from tasks.matching import run_request_matching, run_trip_matching


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


class PassengerListResource(Resource):
    def post(self):
        passengers = Passenger.query.all()
        passengers_list = [passenger.to_dict() for passenger in passengers]
        return make_response(jsonify(passengers_list), 200)


class UserExistenceResource(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True, help="Email cannot be blank!")
        args = parser.parse_args()

        passenger = Passenger.query.filter_by(email=args['email']).first()
        driver = Driver.query.filter_by(email=args['email']).first()

        if passenger or driver:
            return make_response(jsonify({"exists": True}), 200)
        else:
            return make_response(jsonify({"exists": False}), 200)


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
                    password = contents.get("password"),
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
                    password = contents.get("password"),
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
    def post(self):
        contents = get_user_details_parser.parse_args()
        
        user = get_user_from_username(contents.get("username"))
        if user == None or user.password != contents.get("password"):
            return make_response({"error": "That user does not exist or has incorrect password"}, 301)
       
        user_type = contents.get("user_type")
        if user_type not in ["driver", "passenger"]:
            return make_response({"error": "user_type must be provided and be either 'driver' or 'passenger'"}, 400)
            
        if user_type == "driver":
            driver_id = get_driver_id_from_username(contents.get("username"))
            if driver_id is None:
                return make_response({"error": "Driver does not exist"}, 404)
        elif user_type == "passenger":
            passenger_id = get_passenger_id_from_username(contents.get("username"))
            if passenger_id is None:
                return make_response({"error": "Passenger does not exist"}, 404)

        return make_response(user.to_dict(), 200)


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
        conflicting = check_for_conflicting_times_driver(driver_id, contents.get("start_time"), contents.get("end_time"))
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
            start_address = start_location.get("address"),
            end_address = end_location.get("address"),
            seats_remaining=seats_available,
            distance_addition=contents.get("distance_addition"),
            driver=driver,
            driver_id=driver_id,
        )

        db.session.add(new_trip)
        db.session.commit()
        return make_response(new_trip.to_dict(), 201)


class CreateTripRequest(Resource):
    def post(self):
        contents = create_trip_request_parser.parse_args()
        passenger_id = get_passenger_id_from_username(contents.get("username"))
        if not passenger_id:
            return make_response("No passenger exists under this username", 400)

        passenger = get_passenger_from_driver_id(passenger_id)
        
        pickup_location = contents.get("pickup_location")
        dropoff_location = contents.get("dropoff_location")
        
        conflicting = check_for_conflicting_times_passenger(passenger_id, contents.get("pickup_window_start"), contents.get("pickup_window_end"))
        if conflicting:
            return make_response("Conflicting trips scheduled. Please remove the prior logged trip before requesting a trip.", 400)

        new_trip_request = TripRequest(
            passenger_id=passenger_id,
            passenger=passenger,
            start_address = pickup_location.get("address"),
            end_address = dropoff_location.get("address"),
            requested_time=contents.get("requested_time"),
            pickup_location=f'Point({pickup_location.get("longitude")} {pickup_location.get("latitude")})',
            dropoff_location=f'Point({dropoff_location.get("longitude")} {dropoff_location.get("latitude")})',
            window_start_time=contents.get("pickup_window_start"),
            window_end_time=contents.get("pickup_window_end")
        )

        db.session.add(new_trip_request)
        db.session.commit()

        return make_response(new_trip_request.to_dict(), 201)


class GetAllTrips(Resource):
    def post(self):
        contents = get_user_parser.parse_args()
        user = get_user_from_username(contents.get("username"))
        driver_id = get_driver_id_from_username(contents.get("username"))
        if driver_id:
            trips = db.session.execute(db.select(Trip).filter_by(driver_id=driver_id)).scalars().all()
            trips_data = [trip.to_dict() for trip in trips]
            return make_response({"trips": trips_data}, 200)
        else:
            return make_response("There is no driver under this username.", 400)


class GetPendingTrips(Resource):
    def post(self):
        contents = get_user_parser.parse_args()
        user = get_user_from_username(contents.get("username"))
        driver_id = get_driver_id_from_username(contents.get("username"))
        if driver_id:
            trips = db.session.execute(db.select(Trip).filter_by(driver_id=driver_id, status="PENDING")).scalars().all()
            trips_data = [trip.to_dict() for trip in trips]
            return make_response({"trips": trips_data}, 200)
        else:
            return make_response("There is no driver under this username.", 400)


class GetAllTripRequests(Resource):
    def post(self):
        contents = get_user_parser.parse_args()
        user = get_user_from_username(contents.get("username"))
        passenger_id = get_passenger_id_from_username(contents.get("username"))
        if passenger_id:
            trips = db.session.execute(db.select(TripRequest).filter_by(passenger_id=passenger_id)).scalars().all()
            trips_data = [trip.to_dict() for trip in trips]
            return make_response({"trip_requests": trips_data}, 200)
        else:
            return make_response("There is no passenger under this username.", 400)


class GetPendingTripRequests(Resource):
        def post(self):
            contents = get_user_parser.parse_args()
            user = get_user_from_username(contents.get("username"))
            passenger_id = get_passenger_id_from_username(contents.get("username"))
            if passenger_id:
                trips = db.session.execute(db.select(TripRequest).filter_by(passenger_id=passenger_id, status="PENDING")).scalars().all()
                trips_data = [trip.to_dict() for trip in trips]
                return make_response({"trip_requests": trips_data}, 200)
            else:
                return make_response("There is no passenger under this username.", 400)


class GetNearbyTripRequests(Resource):
        def post(self):
            contents = nearby_trip_requests_parser.parse_args()
            user = (contents.get("username"))
            driver_id = get_driver_id_from_username(contents.get("username"))   
            trip = db.session.execute(db.select(Trip).filter_by(id=contents.get("trip_id"))).scalars().first()
            if trip is None:
               return make_response("There is no trip under this ID.", 400)
            start_point = to_shape(trip.start_location)
            willing_distance_to_travel = trip.seats_remaining 
            if trip.seats_remaining is not None: 
                if trip.seats_remaining == 0:
                    return make_response([], 200)
                willing_distance_to_travel = trip.distance_addition / trip.seats_remaining 
            else: 
                willing_distance_to_travel =  trip.distance_addition / trip.driver.car.max_available_seats
            
            choices = distance_query(start_point.x, start_point.y, willing_distance_to_travel)
            return make_response(choices, 200)


class GetApprovedTripRequests(Resource):
        def post(self):
            contents = nearby_trip_requests_parser.parse_args()
            driver_id = get_driver_id_from_username(contents.get("username"))
            trip_id = contents.get("trip_id")
            if driver_id:
                trip_query = db.session.execute(db.select(Trip).filter_by(id=contents.get("trip_id"))).scalars().first()
                if trip_query:
                    ans = [trip.id for trip in trip_query.trip_requests]
                    return make_response(f"Accepted trip requests are: {ans}", 200)
                else:
                    return make_response(f"This is not a valid trip id.", 400)
            else:
                return make_response("There is no driver under this username.", 400)


class ApproveRequest(Resource):
        def post(self):
            contents = approve_requests_parser.parse_args()
            username = contents.get("username")
            trip_req_id = contents.get("trip_request_id")
            driver_id = get_driver_id_from_username(contents.get("username"))
            if driver_id:
                trip_request_query = db.session.execute(db.select(TripRequest).filter_by(id=contents.get("trip_request_id"), status="PENDING")).scalars().first()
                trip_query = db.session.execute(db.select(Trip).filter_by(id=contents.get("trip_id"))).scalars().first()
                if trip_query and trip_request_query:
                    if trip_query.seats_remaining is not None: 
                        seats =  trip_query.seats_remaining 
                    else:
                        seats = trip_query.driver.car.max_available_seats

                    if len(trip_query.trip_requests) < seats:
                        trip_request_query.status = TripRequestState.MATCHED
                        db.session.commit()
                        link_trip_request_to_trip(contents.get("trip_id"), contents.get("trip_request_id"))
                        return make_response(f"Trip {contents.get('trip_request_id')} has successfully been added to the trip.", 200)
                    else:
                        return make_response("Your current trip is full.", 400)

                else:
                    return make_response("This is no longer a trip request or trip.", 400)

            else:
                return make_response(f"There is no driver under the username: {username}", 400)

class Test(Resource):
    def get(self):
        result = distance_query( -123.4194, 37.7749, 90)

        worked = link_trip_request_to_trip("a5cade10-3b8b-4ff2-80db-eab01946e4c8", "735eb991-1c24-4108-896d-0f08c32eb226")
        worked2 = link_trip_request_to_trip("a5cade10-3b8b-4ff2-80db-eab01946e4c8", "50eb1230-8e50-4ec9-93ac-179121c254a1")

        trip = db.session.execute(db.select(Trip).filter_by(id="a5cade10-3b8b-4ff2-80db-eab01946e4c8")).scalars().first()

        return make_response("Num trip requests" + str(len(trip.trip_requests)), 205)
        # return make_response(f"distance = {result}", 200)

### Resources for methods that have POST and specific get methods ###
api.add_resource(Health, "/health")
api.add_resource(CreateDriver, "/driver/create")
api.add_resource(CreatePassenger, "/passenger/create")
api.add_resource(CreateTrip, "/trip/create")
api.add_resource(CreateTripRequest, "/trip_request/create")
api.add_resource(GetUser, "/profile")
api.add_resource(GetAllTrips, "/trips/get/all")
api.add_resource(GetPendingTrips, "/trips/get/pending")
api.add_resource(GetAllTripRequests, "/trip_requests/get/all")
api.add_resource(GetPendingTripRequests, "/trip_requests/get/pending")
api.add_resource(GetNearbyTripRequests, "/trip/get/pending_nearby")
api.add_resource(GetApprovedTripRequests, "/trip/get/approved")
api.add_resource(ApproveRequest, "/trip/post/approved")
api.add_resource(Test, "/test")
