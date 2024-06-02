import http from "k6/http";
import { check, sleep, group } from "k6";

const ENDPOINT = __ENV.ENDPOINT;

function simulateUserLoginTest() {
  let url = `${ENDPOINT}/profile`;
  const payload = JSON.stringify({
    "username": "jDoe11",
    "password": "53%32",
    "user_type": "driver"
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(url, payload, params);
  check(response, { 'Fetch Driver Profile': (r) => r.status === 200 });
  sleep(1);
}

function simulateGetPendingTripTest() {
  let url = `${ENDPOINT}/trips/get/pending`;


    const payload = JSON.stringify({
        "username": "jDoe11",
        "password": "53%32",
    });

  const params = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(url, payload, params);
  check(response, { 'is status 200': (r) => r.status === 200 });
  sleep(1);
}



export const options = {
    scenarios: { 
        studier: { 
           exec: 'simulateUserLogin', 
           executor: "ramping-vus", 
           stages: [ 
              { duration: "2m", target: 100 }, 
              { duration: "2m", target: 25 }, 
              { duration: "2m", target: 0 }, 
           ], 
        }, 
        getPendingTrip: { 
          exec: 'simulateTripCreation', 
          executor: "ramping-vus", 
          stages: [ 
             { duration: "2m", target: 100 }, 
             { duration: "2m", target: 25 }, 
             { duration: "2m", target: 0 }, 
          ], 
       }     
    }, 
};

export function setup() {
  // Create a driver user
  let url = `${ENDPOINT}/driver/create`;
  const payload = JSON.stringify({
    "username": "jDoe11",
    "password": "53%32",
    "name": "John Doe",
    "phone_number": "1234567890",
    "email": "john.doe1@example.com",
    "max_available_seats": 4,
    "licence_plate": "319IRG"
  });
  const params = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(url, payload, params);
  check(response, { 'Sign Up a Driver': (r) => r.status === 201 });

  sleep(1);
  let url2 = `${ENDPOINT}/trip/create`;

    const payload2 = JSON.stringify({
        "username": "jDoe11",
        "password": "53%32",
        "start_time": "2024-05-31T07:38:56Z",
        "end_time": "2024-05-31T08:00:00Z",
        "start_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "123 street road, Brisbane, QLD"},
        "end_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "125 street road, Brisbane, QLD"},
        "seats_remaining": 3,
        "distance_addition": 4
    });

  const params2 = { headers: { 'Content-Type': 'application/json' } };
  let response2 = http.post(url2, payload2, params2);
  check(response2, { 'is status 201': (r) => r.status === 201 });

}

export function simulateUserLogin() {
    group('User Actions', function () {
      simulateUserLoginTest();
    });
}
export function simulateTripCreation() {
    group('User Actions', function () {
      simulateGetPendingTripTest();
    });
}