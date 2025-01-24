import React, { useEffect, useState } from "react";
import { useRide } from "../../../Context/RideContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Summary.css";

const Summary = () => {
  const { rideDetails, resetRideDetails } = useRide();
  const navigate = useNavigate();
  const [sourceName, setSourceName] = useState("Loading...");
  const [destinationName, setDestinationName] = useState("Loading...");

  const fetchLocationNameFromBackend = async (lat, lng, setter) => {
    try {
      const response = await axios.get("http://localhost:3000/rides/location-name", {
        params: { lat, lng },
      });
      setter(response.data.locationName || "Unknown Location");
    } catch (error) {
      console.error("Error fetching location name from backend:", error);
      setter("Error fetching location");
    }
  };

  useEffect(() => {
    if (rideDetails.source) {
      fetchLocationNameFromBackend(rideDetails.source.lat, rideDetails.source.lng, setSourceName);
    }
    if (rideDetails.destination) {
      fetchLocationNameFromBackend(
        rideDetails.destination.lat,
        rideDetails.destination.lng,
        setDestinationName
      );
    }
  }, [rideDetails.source, rideDetails.destination]);

  const handleSubmit = async () => {
try { 
  console.log("Ride Details:", rideDetails);


  const requiredFields = [
    "source",
    "destination",
    "date",
    "pickupTime",
    "NumberOfPassengers",
    "luggage",
    "PricePerSeat",
    "route",
  ];

  const missingFields = requiredFields.filter((field) => !rideDetails[field]);

  if (missingFields.length > 0) {
    alert(`All the fields must be filled InOrder to Submit your Drive . ${missingFields.join(", ")} are required`);
    return;
  }

  
  const token = localStorage.getItem("token");


  if (!token) {
    alert("User not authenticated. Please log in.");
    return;
  }


    if (token) {
      const response = await axios.post("http://localhost:3000/rides/addRide", rideDetails ,
       {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if(response.data.message === 'Ride added successfully!'){
        alert("Your Ride was Published Successfully!")
        navigate('/');
      }
    
    }
  
} catch (error) {
  console.log(error);
  alert("Submitting Ride Failed");
}
  }


  const navigateToHome = () => {
    navigate("/");
  };

  const handleCancel = () => {
    resetRideDetails();
   navigateToHome(); 
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">Ride Summary</h2>
      <div className="summary-content">
        <div className="summary-details">
          <p>
            <strong>Source:</strong> {sourceName}
          </p>
          <p>
            <strong>Destination:</strong> {destinationName}
          </p>
          <p>
            <strong>Date:</strong> {rideDetails.date}
          </p>
          <p>
            <strong>Pickup Time:</strong> {rideDetails.pickupTime}
          </p>
          <p>
            <strong>Number of Passengers:</strong> {rideDetails.NumberOfPassengers}
          </p>
          <p>
            <strong>Luggage:</strong> {rideDetails.luggage}
          </p>
          <p>
            <strong>Pets Allowed:</strong> {rideDetails.pets ? "Yes" : "No"}
          </p>
          <p>
            <strong>Smoking Allowed:</strong> {rideDetails.Smoking ? "Yes" : "No"}
          </p>
          <p>
            <strong>StopOver:</strong> {rideDetails.StopOver ? "Yes" : "No"}
          </p>
          <p>
            <strong>Price Per Seat:</strong> {rideDetails.PricePerSeat}
          </p>
        </div>
        {rideDetails.route.length > 0 && (
          <div className="map-container">
            <h3>Route Map</h3>
            <MapContainer
              style={{ height: "300px", width: "100%" }}
              center={[rideDetails.route[0].lat, rideDetails.route[0].lng]}
              zoom={12}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polyline
                positions={rideDetails.route.map((point) => [point.lat, point.lng])}
                color="blue"
              />
              <Marker position={[rideDetails.route[0].lat, rideDetails.route[0].lng]}>
                <Popup>Source</Popup>
              </Marker>
              <Marker
                position={[
                  rideDetails.route[rideDetails.route.length - 1].lat,
                  rideDetails.route[rideDetails.route.length - 1].lng,
                ]}
              >
                <Popup>Destination</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
      <div className="summary-actions">
        <button className="summary-button-cancel-button" onClick={handleCancel}>
          Cancel
        </button>
        <button className="summary-button-submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Summary;
