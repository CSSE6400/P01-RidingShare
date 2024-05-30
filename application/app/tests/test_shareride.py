from base import RideTest
import unittest
import json
from data import *
import time
import time

class Test1(RideTest):

    def test_1_create_passenger(self):
        # Test to ensure a passenger can be created successfully with the correct status code and matching details.
        response = self.client.post('/passenger/create', json=PASSENGER_JOHN)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
        self.assertEqual(response.json['name'], PASSENGER_JOHN['name'], "Passenger name should match the request data")
        self.assertEqual(response.json['phone_number'], PASSENGER_JOHN['phone_number'], "Passenger phone number should match the request data")
        self.assertEqual(response.json['email'], PASSENGER_JOHN['email'], "Passenger email should match the request data")

    def test_2_passenger_already_exists(self):
        # Test to verify the system correctly handles attempts to create a duplicate passenger.
        response = self.client.post('/passenger/create', json=PASSENGER_JOHN)
        self.assertEqual(response.status_code, 202, "Expected status code to be 202 Created")
        self.assertEqual(response.json['message'], "User account is already a passenger",
                         "Response message should indicate that the user is already a passenger")

    def test_3_add_trip_request(self):
        # Test to verify that trip requests can be successfully created for a passenger.
        response = self.client.post('/trip_request/create', json=RIDE_REQUEST_JOHN)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")

    def test_4_conflicting_trip_request_schedule(self):
        # Test to verify that trip requests can be successfully created for a passenger.
        response = self.client.post('/trip_request/create', json=RIDE_REQUEST_JOHN)
        self.assertEqual(response.status_code, 400, "Expected status code to be 400 Created")
        self.assertEqual(response.json['message'], "Conflicting trips scheduled. Please remove the prior logged trip before requesting a trip.",
                         "Response message should indicate that the passenger is already has a trip request scheduled at the same time")

    def test_5_get_trip_requests(self):
        # Test to ensure that trip requests for a specific passenger can be retrieved correctly.
        response = self.client.post('/trip_requests/get/all', json={"username": "jDoe12", "password": "53%32"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json['trip_requests'][0]['start_address'], RIDE_REQUEST_JOHN['pickup_location']['address'])
    
class Test2(RideTest):

    def test_1_create_driver(self):
        # Test to ensure a driver can be created with the correct details and status code.
        response = self.client.post('/driver/create', json=DRIVER_MOE)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
        self.assertEqual(response.json['name'], DRIVER_MOE['name'], "Driver name should match the request data")
        self.assertEqual(response.json['phone_number'], DRIVER_MOE['phone_number'], "Driver phone number should match the request data")
        self.assertEqual(response.json['email'], DRIVER_MOE['email'], "Driver email should match the request data")

    def test_2_create_trip(self):
        # Test to verify that drivers can create trip requests successfully.
        response = self.client.post('/trip/create', json=TRIP_REQUEST_MOE)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")

    def test_3_conflicting_trip_schedule(self):
        # Test to verify that drivers cannot schedule con.
        response = self.client.post('/trip/create', json=TRIP_REQUEST_MOE)
        self.assertEqual(response.status_code, 400, "Expected status code to be 400 Created")
        self.assertEqual(response.json['message'], "Conflicting trips scheduled. Please remove the prior logged trip before requesting a trip.",
                         "Response message should indicate that the driver is already has a trip scheduled at the same time")


    def test_4_nondrivers_cannot_create_trip(self):
        # Test to check the system properly handles trip creation attempts by non-drivers.
        response = self.client.post('/trip/create', json=TRIP_REQUEST_LEO)
        self.assertEqual(response.status_code, 301, "Expected status code to be 301 Created")
        self.assertEqual(response.json['error'], "That user does not exist or has incorrect login details.")
                         
    def test_5_get_all_trips_for_user(self):
        # Test to verify that all trips associated with a specific driver can be retrieved.
        response = self.client.post('/trips/get/all', json={"username": "Moedab11", "password": "53%31"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json['trips'][0]['start_address'], TRIP_REQUEST_MOE['start_location']['address'])

class Test3(RideTest):

    trip_id = None
    trip_request_id = None
    def test_1_get_all_nearby_pending_trips(self):
        #test to verify that driver gets all pending ride requests that are nearby and in the correct time frame
        driver = self.client.post('/driver/create', json=DRIVER_LEO) # Leo creates driver profile
        trip = self.client.post('/trip/create', json=TRIP_REQUEST_LEO) # Leo creates a trip 
        Test3.trip_id = trip.json['id']

        passenger_kylie = self.client.post('/passenger/create', json=PASSENGER_KYLIE) # Kylie creates a passenger profile
        ride_request_kylie = self.client.post('/trip_request/create', json=RIDE_REQUEST_KYLIE) # Kylie creates a ride request

        passenger_chris = self.client.post('/passenger/create', json=PASSENGER_CHRIS) # Chris creates a passenger profile
        ride_request_chris = self.client.post('/trip_request/create', json=RIDE_REQUEST_CHRIS) # Chris creates a ride request

        ride_request_john = self.client.post('/trip_request/create', json=RIDE_REQUEST_JOHN_2) # John creates another ride request
        print("john",ride_request_john.json)

        time.sleep(1)
        response = self.client.post('/trip/get/pending_nearby', json={"username": "lSmith88", "trip_id": Test3.trip_id, "password": "53%30"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        print("hello",response.json)
        #Kylie's request should not be fetched since she is not nearby, Chris's request should not be fetched because it is oustide the trip's timeframe
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json['Trips'][0]['passenger_name'], "John Doe")
        Test3.trip_request_id = response.json['Trips'][0]['id']

    def test_2_approve_trip_request(self):
        # test to verify that the driver can approve trip requests
        # Leo approves John's request to join his trip
        response = self.client.post('/trip/post/approve', json={"username": "lSmith88", "trip_id": Test3.trip_id, "trip_request_id": Test3.trip_request_id, "password": "53%30"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(response.json['message'], f"Trip {PASSENGER_JOHN.get('name')} has successfully been added to the trip.",
                         "Response message should indicate that the trip request has been approved")

    def test_3_get_approved_trip_requests(self):
        # test to verify that the driver can retreive all the approved trip requests
        response = self.client.post('/trip/get/approved', json={"username": "lSmith88", "trip_id": Test3.trip_id, "password": "53%30"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(response.json["accepted_trips"][0], Test3.trip_request_id)

        response = self.client.post('/trip_requests/get', json={"trip_request_id": Test3.trip_request_id, "username": "lSmith88", "password": "53%30"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(response.json["status"], "MATCHED")
        self.assertEqual(response.json["trip_id"], Test3.trip_id)



        




# Main block to run tests
if __name__ == '__main__':
    unittest.main()
