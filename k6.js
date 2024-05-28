import http from "k6/http";
import { check, sleep, group } from "k6";

const ENDPOINT = __ENV.ENDPOINT;

function simulateUserLogin() {
  let url = `${ENDPOINT}/profile`;
  const payload = JSON.stringify({
    "username": "jDoe11",
    "password": "53%32",
    "user_type": "driver"
  });

  const params = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(url, payload, params);
  check(response, { 'is status 201': (r) => r.status === 201 });
  sleep(1);
}

function simulateTripCreation() {
  let url = `${ENDPOINT}/trip/create`;
  const now = new Date();
    // Randomize the start time to be within the next 1 to 10 days
    const startInMinutes = Math.floor(Math.random() * 14400) + 1440; // 1440 minutes in a day, up to 10 days
    const startTime = new Date(now.getTime() + startInMinutes * 60000);
    
    // End time is 1 to 4 hours after start time, but could be more for longer durations
    const endInMinutes = Math.floor(Math.random() * 180) + 60; // between 1 hour (60 minutes) and 4 hours (240 minutes)
    const endTime = new Date(startTime.getTime() + endInMinutes * 60000);

    const payload = JSON.stringify({
        "username": "jDoe11",
        "start_time": startTime.toISOString(),
        "end_time": endTime.toISOString(),
        "start_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "123 street road, Brisbane, QLD"},
        "end_location": {"latitude": 37.7749, "longitude": -122.4194, "address": "125 street road, Brisbane, QLD"},
        "seats_remaining": 3,
        "distance_addition": 4
    });

  const params = { headers: { 'Content-Type': 'application/json' } };
  let response = http.post(url, payload, params);
  check(response, { 'is status 201': (r) => r.status === 201 });
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
        
     }, 
    // scenarios: {
    //     RegularTraffic: {
    //         executor: 'per-vu-iterations',
    //         vus: 10000,
    //         iterations: 1,
    //         exec: 'simulateUserLogin'
    //     },
        // RushHourTraffic: {
        //     executor: 'per-vu-iterations',
        //     vus: 10000,
        //     iterations: 1,
        //     exec: 'simulateTripCreation'
        // },
        // VariableDemand: {
        //     executor: 'ramping-arrival-rate',
        //     startRate: 5,
        //     timeUnit: '1m',
        //     stages: [
        //         { target: 20, duration: '5m' }, // Peak time
        //         { target: 5, duration: '3m' },  // Off-peak
        //         { target: 20, duration: '2m' } // Back to peak
        //     ],
        //     preAllocatedVUs: 50,
        //     maxVUs: 200,
        //     exec: 'simulateTripCreation'
        // },
        // EventSurge: {
        //     executor: 'per-vu-iterations',
        //     vus: 10000,
        //     iterations: 1,
        //     exec: 'simulateUserLogin'
        // },
        // TargetedPromotion: {
        //     executor: 'per-vu-iterations',
        //     vus: 2000,
        //     iterations: 1,
        //     exec: 'simulateUserLogin'
        // }
    };

export function simulateUserLogin() {
    group('User Actions', function () {
      simulateUserLogin();
    });
}
export function simulateTripCreation() {
    group('User Actions', function () {
        simulateTripCreation();
    });
}