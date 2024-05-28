PASSENGER_JOHN = {
                "username": "jDoe12",
                "password": "53%32",
                "name": "John Doe",
                "phone_number": "1234567890",
                "email": "john.doe1@example.com"
            }

PASSENGER_KYLIE = {
                "username": "kWhite34",
                "password": "53%34",
                "name": "Kylie White",
                "phone_number": "1234567890",
                "email": "KyWhite@example.com"
            }

PASSENGER_CHRIS = {
                "username": "CAdams34",
                "password": "53%34",
                "name": "Chris Adams",
                "phone_number": "1234567890",
                "email": "ChrisA@example.com"
            }

DRIVER_MOE = {
                "username": "Moedab11",
                "password": "53%31",
                "name": "Mohamad Dabboussi",
                "phone_number": "1234567890",
                "email": "mohamaddabboussi@example.com",
                "max_available_seats": 3,
                "licence_plate": "319IRG"
            }

DRIVER_LEO = {
                "username": "lSmith88",
                "password": "53%30",
                "name": "Leo Smith",
                "phone_number": "1234567890",
                "email": "Leosmith@example.com",
                "max_available_seats": 3,
                "licence_plate": "319IRF"
            }

TRIP_REQUEST_MOE = {
                "username": "Moedab11",
                "start_time": "2024-05-10T10:00:00Z",
                "end_time": "2024-05-10T10:30:00Z",
                "start_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "123 street road, Brisbane, QLD"},
                "end_location": {"latitude": 37.7750, "longitude": -122.4195, "address": "125 street road, Brisbane, QLD"},
                "seats_remaining": 3,
                "distance_addition": 200
            }

RIDE_REQUEST_JOHN = {
                "username": "jDoe12",
                "pickup_location": {"latitude": 37.7751, "longitude": -122.4153, "address": "123 street road, Brisbane, QLD"},
                "dropoff_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "125 street road, Brisbane, QLD"},
                "pickup_window_start": "2024-05-10T10:30:00",
                "pickup_window_end": "2024-05-10T11:30:00Z"
            }

RIDE_REQUEST_JOHN_2 = {
                "username": "jDoe12",
                "pickup_location": {"latitude": -27.4711, "longitude": 153.0235, "address": "Post Office Square, Brisbane, QLD"},
                "dropoff_location": {"latitude": -27.4817, "longitude": 153.0292, "address": "The Brisbane Showgrounds, QLD"},
                "pickup_window_start": "2024-05-10T07:00:00",
                "pickup_window_end": "2024-05-10T07:30:00Z"
            }

RIDE_REQUEST_CHRIS = {
                    "username": "CAdams34",
                    "pickup_location": {"latitude": -27.4711, "longitude": 153.0235, "address": "Post Office Square, Brisbane, QLD"},
                    "dropoff_location": {"latitude": -27.4817, "longitude": 153.0292, "address": "The Brisbane Showgrounds, QLD"},
                    "pickup_window_start": "2024-05-10T10:30:00",
                    "pickup_window_end": "2024-05-10T11:30:00Z"
                }

TRIP_REQUEST_LEO = {
                        "username": "lSmith88",
                        "start_time": "2024-05-10T07:00:00Z",
                        "end_time": "2024-05-10T07:30:00Z",
                        "start_location": {"latitude": -27.4705, "longitude": 153.0260, "address": "Queen Street Mall, Brisbane, QLD"},
                        "end_location": {"latitude": -27.4828, "longitude": 153.0283, "address": "Roma Street Parkland, Brisbane, QLD"},
                        "seats_remaining": 2,
                        "distance_addition": 4
                    }

RIDE_REQUEST_KYLIE = {
                    "username": "kWhite34",
                    "pickup_location": {"latitude": 37.7751, "longitude": -122.4153, "address": "123 street road, Brisbane, QLD"},
                    "dropoff_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "125 street road, Brisbane, QLD"},
                    "pickup_window_start": "2024-05-10T07:00:00",
                    "pickup_window_end": "2024-05-10T07:30:00Z"
                }