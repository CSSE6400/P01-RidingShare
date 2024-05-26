from base import RideTest
import unittest
import json

PASSENGER_1 = {
                "username": "jDoe13",
                "password": "53%32",
                "name": "John Doe",
                "phone_number": "1234567890",
                "email": "john.doe1@example.com"
            }

class TestCreatePassenger(RideTest):
    def test_create_passenger(self):
   
        response = self.client.post('/passenger/create', json=PASSENGER_1)

        self.assertEqual(response.status_code, 201, "Expected status code to be 201 Created")
        
        
        self.assertEqual(response.json['name'], PASSENGER_1['name'], "Passenger name should match the request data")
        self.assertEqual(response.json['phone_number'], PASSENGER_1['phone_number'], "Passenger phone number should match the request data")
        self.assertEqual(response.json['email'], PASSENGER_1['email'], "Passenger email should match the request data")

        # Additional checks can be added here, like checking if the object exists in the database

    def test_passenger_already_exists(self):

        response = self.client.post('/passenger/create', json=PASSENGER_1)

        self.assertEqual(response.status_code, 202, "Expected status code to be 202 Created")
        
        # Optionally check the response message
        self.assertEqual(response.json['message'], "User account is already a passenger", 
                         "Response message should indicate that the user is already a passenger")

# Main block to run tests
if __name__ == '__main__':
    unittest.main()
