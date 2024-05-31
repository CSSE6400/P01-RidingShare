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
def run_trip_matching(new_trip_request_id) -> None:
	with db.session.begin():
		new_trip_request = get_trip_request_from_id(new_trip_request_id)

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
					willing_distance_to_travel = trip.distance_addition / trip.seats_remaining / 2
			else:
				willing_distance_to_travel =  trip.distance_addition / trip.driver.car.max_available_seats / 2
 
			# Calculate distance between set point and pickup location of the request
			start_dist = haversine(start_point.x, start_point.y, start_point_trip.x, start_point_trip.y)
			end_dist = haversine(end_point.x, end_point.y, end_point_trip.x, end_point_trip.y)
			

			if abs(start_dist) <= willing_distance_to_travel and abs(end_dist) <= willing_distance_to_travel and new_trip_request.window_start_time <= trip.start_time and new_trip_request.window_end_time >= trip.start_time:
				trip.optional_trip_requests += "," + new_trip_request_id
				db.session.commit()
				return "Successful Match Found"
				
		return "No successful Match Found"

@shared_task(ignore_result=True, retry=3, max_retries=5, retry_backoff=True, retry_jitter=True)
def run_request_matching(contents) -> None:
	with db.session.begin():
		user = (contents.get("username"))
		driver_id = get_driver_id_from_username(contents.get("username"))   

		trip = db.session.execute(db.select(Trip).filter_by(id=contents.get("trip_id"))).scalars().first()

		if trip is None:
			return "No successful Match Found"

		start_point = to_shape(trip.start_location)
		end_point = to_shape(trip.end_location)
		willing_distance_to_travel = trip.seats_remaining 
		seats_remaining = trip.seats_remaining

		empty_recommendation_spots = (2 * seats_remaining)
		choices = []
		if trip.optional_trip_requests != "":
			options = optional_trip_requests.split(",")[1:]
			empty_recommendation_spots -= (len(options))
			choices.append(options)

		if trip.seats_remaining is not None: 
			if trip.seats_remaining == 0:
				return "No successful Match Found"
			willing_distance_to_travel = trip.distance_addition / trip.seats_remaining 
		else: 
			willing_distance_to_travel =  trip.distance_addition / trip.driver.car.max_available_seats
		
		start_time = trip.start_time
		choices = []
		if (seats_remaining):
			choices = distance_query(start_point.x, start_point.y, end_point.x, end_point.y, willing_distance_to_travel / 2, (2 * seats_remaining), start_time)
			for trip_req in choices:
				trip.optional_trip_requests += "," + (trip_req['id'])

		db.session.commit()
		if choices != []:
			return "Successful Match Found"
		else:
			return "No successful Match Found"
