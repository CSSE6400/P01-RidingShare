export const fetchCoordinates = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
  const response = await fetch(url);
  if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
          return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      } else {
          console.log("No results found for the address.");
      }
  } else {
      throw new Error("Failed to fetch coordinates.");
  }
};

export const getNearbyTripRequests = async (tripId, username, password) => {
    const url = "/trip/get/pending_nearby";
    try {
        const response = await fetch(url, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ trip_id: tripId, username, password })
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to fetch nearby trip requests');
        }
    } catch (error) {
        throw error;
    }
  };

  export const approveRequest = async (username, password, tripRequestId, tripId) => {
    const url = "/trip/post/approve";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, trip_request_id: tripRequestId, trip_id: tripId }),
        });
        if (response.ok) {
            return await response.json();
        } else {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    } catch (error) {
        console.error('Error approving trip request:', error);
        throw error;
    }
};