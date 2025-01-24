import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ScheduledRides.css'; // Import the CSS file

const ScheduledRides = () => {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchScheduledRides = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get('http://localhost:3000/requests/get-scheduled-rides', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRides(response.data.response);
      } catch (error) {
        console.error('Error fetching scheduled rides:', error);
      }
    };

    fetchScheduledRides();
  }, []);

  return (
    <div className="scheduled-rides-container">
      <h1 className="page-title">Scheduled Rides</h1>
      <div className="cards-container">
        {rides.map((ride) => (
          <div key={ride._id} className="ride-card">
            <h2 className="card-title">Ride Information</h2>
            <div className="card-details">
              <p><strong>Driver: </strong>{ride.DriverId.username}</p>
              <p><strong>Passenger: </strong>{ride.PassengerId.username}</p>
              <p><strong>Driver Source: </strong>{ride.source.name}</p>
              <p><strong>Passenger Source: </strong>{ride.PassengerSource.name}</p>
              <p><strong>Driver Destination: </strong>{ride.destination.name}</p>
              <p><strong>Passenger Destination: </strong>{ride.PassengerDestination.name}</p>
              <p><strong>Ride Date: </strong>{new Date(ride.rideDate).toLocaleDateString()}</p>
              <p><strong>Ride Time: </strong>{new Date(ride.rideTime).toLocaleTimeString()}</p>
              <p><strong>Cost: </strong>${ride.PassengerCost}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledRides;
