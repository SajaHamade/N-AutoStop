import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RideHistory.css';  
import { Link, useNavigate } from 'react-router-dom';

const RideHistory = () => {
  const [rides, setRides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/requests/get-old-rides', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRides(response.data.response);
      } catch (error) {
        console.error('Error fetching ride history:', error);
      }
    };

    fetchRideHistory();
  }, [navigate]);

  return (
    <div className="ride-history-container">
      <h1 className="page-title">Ride History</h1>
      <div className="rides-container">
        {rides.length === 0 ? (
          <p className="no-rides-message">No ride history available.</p>
        ) : (
          rides.map((ride) => (
            <div key={ride._id} className="ride-card">
              <h2 className="ride-title">Ride Information</h2>
              <div className="ride-info">
                <p><strong>Ride Date: </strong>{new Date(ride.rideDate).toLocaleDateString()}</p>
                <p><strong>Driver: </strong>{ride.DriverId.username}</p>
                <p><strong>Passenger: </strong>{ride.PassengerId.username}</p>

                <h3>Driver's Route</h3>
                <p><strong>Source: </strong>{ride.source.name}</p>
                <p><strong>Destination: </strong>{ride.destination.name}</p>

                <h3>Passenger's Route</h3>
                <p><strong>Source: </strong>{ride.PassengerSource.name}</p>
                <p><strong>Destination: </strong>{ride.PassengerDestination.name}</p>
              </div>

              <div className="feedback-section">
                <Link to={`/feedback/${ride._id}`} className="submit-feedback-btn">
                  Add/View Feedback
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RideHistory;
