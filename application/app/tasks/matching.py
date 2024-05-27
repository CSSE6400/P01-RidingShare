from celery import shared_task 
from models import db

# Task specific imports
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
from models.states_types import TripRequestState, TripState
from views.helpers.args_parser import *
from views.helpers.helpers import *

@shared_task(ignore_result=True, retry=3, max_retries=5, retry_backoff=True, retry_jitter=True)
def run_trip_matching(new_trip_request) -> None:
	## TODO discuss how to handle this 
	with db.session.begin():
		trips = db.session.execute(
			db.select(Trip)
			.filter(
				Trip.status == 'PENDING',
				new_trip_request.window_start_time <= Trip.start_time,
				new_trip_request.window_end_time >= Trip.start_time
			)
			.order_by(Trip.created_at)
		).scalars().all()

		start_point_trip = to_shape(new_trip_request.pickup_location)
		end_point_trip = to_shape(new_trip_request.dropoff_location)

		for trip in trips:
			start_point = to_shape(trip.start_location)
			end_point = to_shape(trip.end_location)
			willing_distance_to_travel = trip.seats_remaining 
			seats_remaining = trip.seats_remaining
			start_time = trip.start_time

			if seats_remaining is not None:		
				if seats_remaining == 0:
					continue
				else:
					willing_distance_to_travel = trip.distance_addition / trip.seats_remaining 
			else:
				willing_distance_to_travel =  trip.distance_addition / trip.driver.car.max_available_seats
 
			# Calculate distance between set point and pickup location of the request
			start_dist = haversine(start_point.x, start_point.y, start_point_trip.x, start_point_trip.y)
			end_dist = haversine(end_point.x, end_point.y, end_point_trip.x, end_point_trip.y)
			distance = willing_distance_to_travel / 2
			
			if abs(start_dist) <= distance and abs(end_dist) <= distance:
				return "Successful Match Found"
			
			if len(nearby_requests) == offers:
				break
					
		return "No successful Match Found"

@shared_task(ignore_result=True, retry=3, max_retries=5, retry_backoff=True, retry_jitter=True)
def run_request_matching(contents) -> None:
	with db.session.begin():
		user = (contents.get("username"))
		driver_id = get_driver_id_from_username(contents.get("username"))   
		trip = db.session.execute(db.select(Trip).filter_by(id=contents.get("trip_id"))).scalars().first()
		if trip is None:
			return make_response("There is no trip under this ID.", 400)
		start_point = to_shape(trip.start_location)
		end_point = to_shape(trip.end_location)
		willing_distance_to_travel = trip.seats_remaining 
		seats_remaining = trip.seats_remaining

		if trip.seats_remaining is not None: 
			if trip.seats_remaining == 0:
				return make_response([], 200)
			willing_distance_to_travel = trip.distance_addition / trip.seats_remaining 
		else: 
			willing_distance_to_travel =  trip.distance_addition / trip.driver.car.max_available_seats
		
		start_time = trip.start_time
		if (seats_remaining):
			choices = distance_query(start_point.x, start_point.y, end_point.x, end_point.y, willing_distance_to_travel / 2, (2 * seats_remaining), start_time)
		else:
			choices = []
		return choices
