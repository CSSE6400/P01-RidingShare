from base import RideTest
import unittest
import json

PASSENGER_1 = {
                "username": "jDoe12",
                "password": "53%32",
                "name": "John Doe",
                "phone_number": "1234567890",
                "email": "john.doe1@example.com"
            }

PASSENGER_2 = {
                "username": "kWhite34",
                "password": "53%34",
                "name": "Kylie White",
                "phone_number": "1234567890",
                "email": "KyWhite@example.com"
            }

DRIVER_1 = {
                "username": "Moedab11",
                "password": "53%31",
                "name": "Mohamad Dabboussi",
                "phone_number": "1234567890",
                "email": "mohamaddabboussi@example.com",
                "max_available_seats": 3,
                "licence_plate": "319IRG"
            }

DRIVER_2 = {
                "username": "lSmith88",
                "password": "53%30",
                "name": "Leo Smith",
                "phone_number": "1234567890",
                "email": "Leosmith@example.com",
                "max_available_seats": 3,
                "licence_plate": "319IRF"
            }

TRIP_REQUEST_1 = {
                "username": "Moedab11",
                "start_time": "2024-05-10T10:00:00Z",
                "end_time": "2024-05-10T10:30:00Z",
                "start_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "123 street road, Brisbane, QLD"},
                "end_location": {"latitude": 37.7750, "longitude": -122.4195, "address": "125 street road, Brisbane, QLD"},
                "seats_remaining": 3,
                "distance_addition": 200
            }

RIDE_REQUEST_2 = {
                "username": "jDoe12",
                "pickup_location": {"latitude": 37.7751, "longitude": -122.4153, "address": "123 street road, Brisbane, QLD"},
                "dropoff_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "125 street road, Brisbane, QLD"},
                "pickup_window_start": "2024-05-10T10:30:00",
                "pickup_window_end": "2024-05-10T11:30:00Z"
            }

INVALID_TRIP_REQUEST = {
                        "username": "lSmith88",
                        "start_time": "2024-05-10T07:00:00Z",
                        "end_time": "2024-05-10T07:30:00Z",
                        "start_location": {"latitude": -27.4705, "longitude": 153.0260, "address": "Queen Street Mall, Brisbane, QLD"},
                        "end_location": {"latitude": -27.4828, "longitude": 153.0283, "address": "Roma Street Parkland, Brisbane, QLD"},
                        "seats_remaining": 2,
                        "distance_addition": 40
                    }

RIDE_REQUEST_1 = {
                    "username": "kWhite34",
                    "pickup_location": {"latitude": -27.4711, "longitude": 153.0235, "address": "Post Office Square, Brisbane, QLD"},
                    "dropoff_location": {"latitude": -27.4817, "longitude": 153.0292, "address": "The Brisbane Showgrounds, QLD"},
                    "pickup_window_start": "2024-05-10T07:00:00",
                    "pickup_window_end": "2024-05-10T07:30:00Z"
                }


class TestCreatePassenger(RideTest):
    def test_1_create_passenger(self):
   
        response = self.client.post('/passenger/create', json=PASSENGER_1)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
        self.assertEqual(response.json['name'], PASSENGER_1['name'], "Passenger name should match the request data")
        self.assertEqual(response.json['phone_number'], PASSENGER_1['phone_number'], "Passenger phone number should match the request data")
        self.assertEqual(response.json['email'], PASSENGER_1['email'], "Passenger email should match the request data")

    def test_2_passenger_already_exists(self):

        response = self.client.post('/passenger/create', json=PASSENGER_1)
        self.assertEqual(response.status_code, 202, "Expected status code to be 202 Created")
        self.assertEqual(response.json['message'], "User account is already a passenger", 
                         "Response message should indicate that the user is already a passenger")

    def test_3_add_trip_request(self):

        response = self.client.post('/trip_request/create', json=RIDE_REQUEST_2)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
 
    def test_4_get_trip_requests(self):
        response = self.client.post('/trip_requests/get/all', json={"username": "jDoe12"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json['trip_requests'][0]['start_address'], RIDE_REQUEST_2['pickup_location']['address'])
    
class TestCreateDriver(RideTest):
    def test_create_driver(self):
   
        response = self.client.post('/driver/create', json=DRIVER_1)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
        self.assertEqual(response.json['name'], DRIVER_1['name'], "Driver name should match the request data")
        self.assertEqual(response.json['phone_number'], DRIVER_1['phone_number'], "Driver phone number should match the request data")
        self.assertEqual(response.json['email'], DRIVER_1['email'], "Driver email should match the request data")

    def test_create_trip(self):

        response = self.client.post('/trip/create', json=TRIP_REQUEST_1)
        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")

    def test_nondrivers_cannot_create_trip(self):

        response = self.client.post('/trip/create', json=INVALID_TRIP_REQUEST)
        self.assertEqual(response.status_code, 404, "Expected status code to be 404 Created")
        self.assertEqual(response.json['message'],"Invalid Driver! Please ensure the username is linked to a driver account.",
                                                                             "Response message should indicate that the user is already a passenger")
    def test_get_all_trips_for_user(self):
        response = self.client.post('/trips/get/all', json={"username": "Moedab11"})
        self.assertEqual(response.status_code, 200, "Expected status code to be 200 OK")
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json['trips'][0]['start_address'], TRIP_REQUEST_1['start_location']['address'])


# Main block to run tests
if __name__ == '__main__':
    unittest.main()
