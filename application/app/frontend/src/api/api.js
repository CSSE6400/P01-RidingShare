export const getPassenger = async () => {
  const url = "/passengers";
  const response = await fetch(url);
  return response.json(); 
}

export const AddPassenger = async (post) => {
  const url = "/passengers";
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  return response.json(); 
};

export const loginUser = async (body) => {
  const url = "/profile"; 
  try {
      const response = await fetch(url, {
          method: 'POST',  
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify(body) 
      });
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Failed to login');
      }
  } catch (error) {
      throw error;
  }
};

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


export const getPendingTripRequests = async (username) => {
  const url = "/trip_requests/get/pending";
  try {
      const response = await fetch(url, {
          method: 'POST',  
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({username}) 
      });
      if (response.ok) {
          return response.json();
      } else {
          throw new Error('Failed to fetch pending trip requests');
      }
  } catch (error) {
      throw error;
  }
};

export const getNearbyTripRequests = async (tripId, username) => {
    const url = "/trip/get/pending_nearby";
    try {
        const response = await fetch(url, {
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ trip_id: tripId, username })
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