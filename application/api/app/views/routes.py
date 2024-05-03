from flask import Blueprint, make_response
from flask_restful import Api, Resource, marshal 

api_bp = Blueprint("api", __name__)
api = Api(api_bp)


class Health(Resource):
	def get(self):
		return make_response({"status": "ok"})


api.add_resource(Health, "/health")