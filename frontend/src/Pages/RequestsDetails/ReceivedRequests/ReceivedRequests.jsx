import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReceivedRequests.css";
import { useNavigate } from "react-router-dom";


const ReceivedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/requests/get-received-requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRequests(response.data.requests);
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleAccept = async (requestId) => {
     try {
 
    const response =  await axios.post(
        `http://localhost:3000/requests/accept-request`,
        {requestId},
     
      );

      if(response.data.message=== 'Request accepted and added to history successfully.'){
         alert("Request accepted!");
         navigate('/upcoming-rides')
      }

     
    
    } catch (err) {
      alert("Failed to accept request.");
    } 
  };

  const handleDeny = async (requestId) => {
   try {
   
      const response = await axios.post(
        `http://localhost:3000/requests/deny-request`, 
        {requestId}
        
      );
      if(response.data.message === 'Request Denied successfully.') {
       alert("Request denied.");
       window.location.reload();
     

      }
    
    } catch (err) {
      alert("Failed to deny request.");
    } 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="receive-requests">
      <h1>Received Requests</h1>
      {requests.length === 0 ? (
        <p>No received requests at the moment.</p>
      ) : (
        <div className="requests-list">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="passenger-info">
                <img
                  src={`http://localhost:3000/images/${request.PassengerId.profilePicture}` || "/default-profile.png"}
                  alt="Passenger Profile"
                  className="profile-picture"
                />
                <div>
                  <p><strong>Name:</strong> {`${request.PassengerId.firstName} ${request.PassengerId.lastName}`}</p>
                  <p><strong>Age:</strong> {calculateAge(request.PassengerId.dateOfBirth)}</p>
                  <p><strong>Phone Number:</strong> {(request.PassengerId.phoneNumber)}</p>
                </div>
              </div>
              <div className="ride-info">
                <p><strong>Passenger Source:</strong> {request.PassengerSource.name}</p>
                <p><strong>Passenger Destination:</strong> {request.PassengerDestination.name}</p>
                <p><strong>Ride Source:</strong> {request.RideId.source.name || "N/A"}</p>
                <p><strong>Ride Destination:</strong> {request.RideId.destination.name || "N/A"}</p>
                <p><strong>Ride Date:</strong> {new Date(request.RideId.ScheduledDate).toLocaleDateString() || "N/A"}</p>
              </div>
              <div className="actions">
                <button onClick={() => handleAccept(request._id)} className="accept-button">Accept</button>
                <button onClick={() => handleDeny(request._id)} className="deny-button">Deny</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests;
