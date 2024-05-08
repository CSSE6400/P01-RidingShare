import React, { useState, useEffect } from 'react';
import { getPassenger, AddPassenger } from '../api/api'; // Adjust the import path as necessary

const PassengerManager = () => {
  const [passengers, setPassengers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: ''
  });

  // Function to load all passengers
  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const data = await getPassenger();
        if (Array.isArray(data)) {
          setPassengers(data);
        } else {
          console.error('Data received is not an array:', data);
        }
      } catch (error) {
        console.error('Failed to fetch passengers:', error);
      }
    };
    
    fetchPassengers();
  }, []);

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddPassenger(formData);
      setFormData({
        name: '',
        phone_number: '',
        email: ''
      });
      // Reload passengers list
      const updatedPassengers = await getPassenger();
      setPassengers(updatedPassengers);
    } catch (error) {
      console.error('Error adding passenger:', error);
    }
  };

  return (
    <div>
      <h1>Manage Passengers</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="text"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <button type="submit">Add Passenger</button>
      </form>

      <h2>Passenger List</h2>
      <ul>
        {passengers?.map((passenger, index) => (
          <li key={index}>{`${passenger.name} - ${passenger.email}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default PassengerManager;
