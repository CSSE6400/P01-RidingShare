from flask_restful import reqparse 

handle_user_password = reqparse.RequestParser()
handle_user_password.add_argument("username", 	            type=str, required=True, help="Username cannot be blank!")
handle_user_password.add_argument("password", 	            type=str, required=True, help="Password cannot be blank!")

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument("username", 	            type=str, required=True, help="Username cannot be blank!")
create_user_parser.add_argument("password", 	            type=str, required=True, help="Password cannot be blank!")
create_user_parser.add_argument("name", 		            type=str, required=True, help="Name cannot be blank!")
create_user_parser.add_argument("phone_number",             type=str, required=True, help="Phone number cannot be blank!")
create_user_parser.add_argument("email", 		            type=str, required=True, help="Email cannot be blank!")

create_driver_parser = create_user_parser.copy()
create_driver_parser.add_argument("max_available_seats",	type=int, required=True, help="The maximum available seats cannot be blank!")
create_driver_parser.add_argument("licence_plate", 		    type=str, required=True, help="License plate cannot be blank!")

create_passenger_parser = create_user_parser.copy()

get_user_details_parser = reqparse.RequestParser()
get_user_details_parser.add_argument("username", 	                type=str, required=True, help="Username cannot be blank!")
get_user_details_parser.add_argument("password", 	                type=str, required=True, help="Password cannot be blank!")
get_user_details_parser.add_argument("user_type", 	                type=str, required=True, help="User type cannot be blank!")

get_user_details_by_username_parser = reqparse.RequestParser()
get_user_details_by_username_parser.add_argument("target_username", 	                type=str, required=True, help="Target username cannot be blank!")
get_user_details_by_username_parser.add_argument("user_type", 	                type=str, required=True, help="User type cannot be blank!")

get_user_parser = reqparse.RequestParser()
get_user_parser.add_argument("username", 	                type=str, required=True, help="Username cannot be blank!")

create_trip_parser = reqparse.RequestParser()
create_trip_parser.add_argument('username',                 type=str, required=True, help="Driver cannot be blank!")
create_trip_parser.add_argument('start_time',               type=str, required=True, help="Start time cannot be blank!")
create_trip_parser.add_argument('end_time',                 type=str, required=True, help="End time cannot be blank!")
create_trip_parser.add_argument('start_location',           type=dict, required=True, help="Start location cannot be blank!")
create_trip_parser.add_argument('end_location',             type=dict, required=True, help="End location cannot be blank!")
create_trip_parser.add_argument('distance_addition',        type=int, required=False, default=10)
create_trip_parser.add_argument('seats_available',          type=int, required=False)
  
create_trip_request_parser = reqparse.RequestParser()
create_trip_request_parser.add_argument('pickup_location', type=dict, required=True, help="Pickup location cannot be blank!")
create_trip_request_parser.add_argument('dropoff_location', type=dict, required=True, help="Dropoff location cannot be blank!")
create_trip_request_parser.add_argument('requested_time', type=str, required=False)
create_trip_request_parser.add_argument('pickup_window_start', type=str, required=True, help="Pickup window start cannot be blank!")
create_trip_request_parser.add_argument('pickup_window_end', type=str, required=True, help="Pickup window end cannot be blank!")    
create_trip_request_parser.add_argument('username', type=str, required=True, help="Username cannot be blank!")
       
nearby_trip_requests_parser = reqparse.RequestParser()
nearby_trip_requests_parser.add_argument('trip_id', type=str, required=True, help="Trip ID cannot be blank!")
nearby_trip_requests_parser.add_argument('username', type=str, required=True, help="Username cannot be blank!")

approve_requests_parser = reqparse.RequestParser()
approve_requests_parser.add_argument('username', type=str, required=True, help="Username cannot be blank!")
approve_requests_parser.add_argument('trip_request_id', type=str, required=True, help="Request ID cannot be blank!")
approve_requests_parser.add_argument('trip_id', type=str, required=True, help="Trip ID cannot be blank!")

get_trip_request_by_id_parser = reqparse.RequestParser()
get_trip_request_by_id_parser.add_argument("trip_request_id", type=str, required=True, help="Trip Request ID cannot be blank!")

get_trip_by_id_parser = reqparse.RequestParser()
get_trip_by_id_parser.add_argument("trip_id", type=str, required=True, help="Trip ID cannot be blank!")

get_cost_parser = reqparse.RequestParser()
get_cost_parser.add_argument('start_location',           type=dict, required=True, help="Start location cannot be blank!")
get_cost_parser.add_argument('end_location',             type=dict, required=True, help="End location cannot be blank!")


