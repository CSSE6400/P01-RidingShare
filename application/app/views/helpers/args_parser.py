from flask_restful import reqparse 

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument("username", 	type=str, required=True, help="Username cannot be blank!")
create_user_parser.add_argument("name", 		type=str, required=True, help="Name cannot be blank!")
create_user_parser.add_argument("phone_number", type=str, required=True, help="Phone number cannot be blank!")
create_user_parser.add_argument("email", 		type=str, required=True, help="Email cannot be blank!")

create_driver_parser = create_user_parser.copy()
create_driver_parser.add_argument("max_available_seats",	type=int, required=True, help="The maximum available seats cannot be blank!")
create_driver_parser.add_argument("licence_plate", 			type=str, required=True, help="License plate cannot be blank!")

create_passenger_parser = create_user_parser.copy()
