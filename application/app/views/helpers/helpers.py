from models import db
from models.user import User
from models.driver import Driver
from models.trip import Trip
from models.passenger import Passenger
from models.trip_request import TripRequest
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

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

def haversine(lon1, lat1, lon2, lat2):
	"""
	Calculate the great-circle distance between two points
	on the Earth's surface using the Haversine formula.
	"""
	# Convert coordinates from degrees to radians
	lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

	dlon = lon2 - lon1
	dlat = lat2 - lat1
	a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
	c = 2 * atan2(sqrt(a), sqrt(1-a))
	radius_earth_km = 6371.0  # Radius of the Earth in kilometers
	distance = radius_earth_km * c
	return distance

def distance_query(set_long, set_lat, distance, trip_requests):
	nearby_requests = []
	## Only search for PENDING to reduce search space
	trip_requests = db.session.execute(db.select(TripRequest).filter_by(status=PENDING)).scalars().all() 

	for request in trip_requests:
		pickup_lon, pickup_lat = request.pickup_location.coords[0]  # Extract longitude and latitude
		# Calculate distance between set point and pickup location of the request
		dist = haversine(set_long, set_lat, pickup_lon, pickup_lat)
		if dist <= distance:
			nearby_requests.append(request)
	return nearby_requests