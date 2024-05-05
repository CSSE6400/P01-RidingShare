from flask import Blueprint, make_response, jsonify, request, render_template
from flask_restful import Api, Resource, marshal, reqparse 
from models import db
from models.passenger import Passenger

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


class PassengerListResource(Resource):
    def post(self):
        return PassengerResource().post()

class Index(Resource):
     def get(self):
         return render_template("index.html")



api.add_resource(Health, "/health")
api.add_resource(PassengerResource, '/passengers/<string:passenger_id>')
api.add_resource(PassengerListResource, '/passengers')



api.add_resource(Index, "/")