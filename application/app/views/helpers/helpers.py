from models import db
from models.user import User
from models.driver import Driver
from models.trip import Trip
from models.passenger import Passenger
from models.trip_request import TripRequest
from datetime import datetime

def get_user_from_username(username) -> User:
	return db.session.execute(db.select(User).filter_by(username=username)).scalars().first()

def get_driver_id_from_username(username):
	result = get_user_from_username(username)
	if result:
		return result.driver_id

def get_passenger_id_from_username(username):
	result = get_user_from_username(username)
	if result:
		return result.passenger_id

def get_driver_from_driver_id(driver_id):
	return db.session.execute(db.select(Driver).filter_by(id=driver_id)).scalars().first()

def get_passenger_from_driver_id(passenger_id):
	return db.session.execute(db.select(Passenger).filter_by(id=passenger_id)).scalars().first()

def check_for_conflicting_times_driver(driver_id, new_trip_start_time, new_trip_end_time):
	user_trips = db.session.execute(db.select(Trip).filter_by(driver_id=driver_id)).scalars().all()

	# Remove 'Z' if present
	new_trip_start_time = new_trip_start_time.replace("Z", "")
	new_trip_end_time = new_trip_end_time.replace("Z", "")

	# Parse into datetime objects
	new_trip_start_time = datetime.strptime(new_trip_start_time, "%Y-%m-%dT%H:%M:%S")
	new_trip_end_time = datetime.strptime(new_trip_end_time, "%Y-%m-%dT%H:%M:%S")

	for trip in user_trips:
		trip_start_time = trip.start_time
		trip_end_time = trip.end_time

		if (new_trip_start_time < trip_end_time and new_trip_end_time > trip_start_time):
			return True 
	return False 


def check_for_conflicting_times_passenger(passenger_id, new_trip_start_time, new_trip_end_time):
	user_trips = db.session.execute(db.select(TripRequest).filter_by(passenger_id=passenger_id)).scalars().all() 

	# Remove 'Z' if present
	new_trip_start_time = new_trip_start_time.replace("Z", "")
	new_trip_end_time = new_trip_end_time.replace("Z", "")

	# Parse into datetime objects
	new_trip_start_time = datetime.strptime(new_trip_start_time, "%Y-%m-%dT%H:%M:%S")
	new_trip_end_time = datetime.strptime(new_trip_end_time, "%Y-%m-%dT%H:%M:%S")

	for trip in user_trips:
		trip_start_time = trip.window_start_time
		trip_end_time = trip.window_end_time

		if (new_trip_start_time < trip_end_time and new_trip_end_time > trip_start_time):
			return True 
	return False 
