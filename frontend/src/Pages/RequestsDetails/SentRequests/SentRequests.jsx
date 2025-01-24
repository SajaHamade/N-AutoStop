import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SentRequests.css";

const SentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/requests/get-sent-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch requests");
        setLoading(false);
      }
    };
    fetchSentRequests();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <h1 className="title">Sent Requests</h1>
      <div className="cards-container">
        {requests.map((request) => (
          <div className="card" key={request._id}>
            <div className="card-content">
              <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
              <p><strong>Source:</strong> {request.PassengerSource.name}</p>
              <p><strong>Destination:</strong> {request.PassengerDestination.name}</p>
              <p><strong>Driver:</strong> {request.DriverId?.username || "N/A"}</p>
              <p className={`status status-${request.status.toLowerCase()}`}>
                <strong>Status:</strong> {request.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentRequests;
