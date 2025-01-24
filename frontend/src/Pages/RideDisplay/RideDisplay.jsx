import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { FaSmoking, FaMoneyBill, FaUser, FaSuitcase, FaDog } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import "./RideDisplay.css";
import { useRide } from "../../Context/RideContext";


const RideDisplay = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { searchDetails } = useRide();
  const [ride, setRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [distance , SetDistance] = useState(0);
  const [cost , SetCost] = useState(0);
  const [showDistance, setShowDistance] = useState(false);
  const[SourceName , SetSourceName] = useState(null);
  const[DestName , SetDestName] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchRideAndDriver = async () => {
      try {
        const rideResponse = await axios.post("http://localhost:3000/rides/getRide", {
          id: rideId,
        });
        const fetchedRide = rideResponse.data.ride;
        setRide(fetchedRide);

        const driverResponse = await axios.post("http://localhost:3000/users/getUser", {
          id: fetchedRide.DriverId,
        });
        setDriver(driverResponse.data.user);


        //This one is in order to prevent the same person who published the ride to request to himself 
        const token = localStorage.getItem("token");
        if (token) {
          const verifiedUser = await axios.get("http://localhost:3000/users/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentUserId(verifiedUser.data.user._id);
        }


      } catch (error) {
        console.error("Error fetching ride or driver details:", error);
      }
    };
     console.log("Search details : ",searchDetails);
    fetchRideAndDriver();
    
  }, [rideId]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  if (!ride || !driver) {
    return <div>Loading...</div>;
  }

  const RequestRide = async () => {
try {
  const token = localStorage.getItem("token");
   console.log(token)

    if (!token) {
      navigate('/login');
      return;
    }

    const verifiedUser = await axios.get("http://localhost:3000/users/verify", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(verifiedUser) {
      const rideDetails = {
        DriverId : ride.DriverId ,
        RideId : ride._id ,
        PassengerId : verifiedUser.data.user._id ,
        PassengerSource: {
          name: SourceName, 
          coordinates: [
            searchDetails.source.lat, 
            searchDetails.source.lng
          ], 
        },
        PassengerDestination : {
          name: DestName, 
          coordinates: [
            searchDetails.destination.lat, 
            searchDetails.destination.lng
          ], } ,
        PassengerDistance : distance ,
        PassengerCost : cost 
      }
      console.log("Ride Details" , rideDetails);
      const request = await axios.post("http://localhost:3000/requests/addRequest" , rideDetails );

      if(request){
        alert("Request Successfully Sent , You will Shortly Receive the Response");
        navigate('/sent-requests');

      }


    }

  
} catch (error) {
  if (error.response && error.response.status === 401) {
    // Token is invalid or expired
    navigate('/login');  // Redirect to login page
  } else {
    // Some other error occurred
    console.error("Error :", error);
     // Optional: You can also show an alert or message
  }
  
}
  }

  const DisplayDistance = async () => {
    if (!searchDetails || !searchDetails.source || !searchDetails.destination) {
      alert("Source or Destination details are missing.");
      return;
    }
  
    const pos1 = searchDetails.source;
    const pos2 = searchDetails.destination;
    const toRadians = (deg) => (deg * Math.PI) / 180;
  
    const { lat: lat1, lng: lon1 } = pos1;
    const { lat: lat2, lng: lon2 } = pos2;
  
    const R = 6371e3; // Earth's radius in meters
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const resultInMeters = R * c;
  
    const resultInKilometers = resultInMeters / 1000;
  
    SetDistance(resultInKilometers.toFixed(2));
  
    try {
      const sourceName = await FetchLocationName(lat1, lon1);
      const destName = await FetchLocationName(lat2, lon2);
      SetSourceName(sourceName);
      SetDestName(destName);
    } catch (error) {
      console.error("Error fetching location names:", error);
      SetSourceName("Unknown Location");
      SetDestName("Unknown Location");
    }
  
    CalculateCost(resultInKilometers.toFixed(2));
  };
  
  
  const CalculateCost = (calculatedDistance) => {
    const cost = calculatedDistance * ride.PricePerSeat;
    SetCost(cost.toFixed(2));
    setShowDistance(true);
  };
  
  const FetchLocationName = async(lat,lng) => {
   
      try {
        const response = await axios.get("http://localhost:3000/rides/location-name", {
          params: { lat, lng },
        });
        return response.data.locationName;
      } catch (error) {
        console.error("Error fetching location name from backend:", error);
        return "Unknown Location"; // Default error handling
      }
    
  }

  return (
  <div>

    <div className="ride-display-container"> 
      <aside className="driver-sidebar">
        <h2>Driver Details</h2>
        <img
          src={`http://localhost:3000/images/${driver.profilePicture}`}
          alt={`${driver.username}'s profile`}
          className="driver-image"
        />
        <p className="driver-name"><strong>{driver.firstName} {driver.lastName}</strong></p>
        <p className="driver-info"><strong>Username:</strong> @{driver.username}</p>
        <p className="driver-info"><strong>Gender:</strong> {driver.gender}</p>
        <p className="driver-info"><strong>Phone Number:</strong> {driver.phoneNumber}</p>
        <p className="driver-info"><strong>Age:</strong> {calculateAge(driver.dateOfBirth)}</p>
        <p className="driver-info"><strong></strong> {driver.description}</p>
        <p className="driver-info"><strong>Joined:</strong> {new Date(driver.createdAt).toLocaleDateString()}</p>
        
      </aside>

      

    
      <main className="ride-content">
       
        <h1>Ride Details</h1>
        <div className="ride-info">
          <h2>Details</h2>
          <p><strong>From:</strong> {ride.source.name}</p>
          <p><strong>To:</strong> {ride.destination.name}</p>
          <p><strong>Date:</strong>{new Date(ride.ScheduledDate).toLocaleDateString()} at {new Date(ride.pickupTime).toLocaleTimeString()}</p>
          <p><strong>StopOver:</strong> {ride.StopOver? "Yes" : "No"}</p>
          <div className="icon-row">
            <span><FaSmoking size={16} color={ride.SmokingAllowed ? "green" : "red"} title="Smoking" /> {ride.SmokingAllowed ? "Yes" : "No"}</span>
            <span><FaSuitcase size={16} title="Luggage" /> {ride.Luggage}</span>
            <span><FaUser size={16} title="Seats Available" /> {ride.NumberOfPassengers}</span>
            <span><FaMoneyBill size={16} title="Price per Seat" /> ${ride.PricePerSeat}</span>
            <span><FaDog size={16} color={ride.PetsAllowed ? "green" : "red"} /> {ride.PetsAllowed ? "Yes" : "No"}</span>
          </div>
        </div>

        {/* Map */}
        <div className="ride-map">
          <h2>Route</h2>
          <MapContainer
            center={[ride.source.coordinates[0], ride.source.coordinates[1]]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
              positions={ride.route.map((point) => [point.lat, point.lng])}
              color="blue"
            />
          </MapContainer>
        </div>
      </main>
    </div>
    {ride.DriverId !== currentUserId && (
        <button className="request-ride-button" onClick={DisplayDistance}>
          Calculate Cost
        </button>
      )}
    {showDistance && distance !== null ? (
      <div className="submit-request-container"> 
  <p>Your {distance}km Trip will cost you {cost}$</p>
  <button className="submit-request-button" onClick={RequestRide}>Submit Request</button>
</div>

) : (
  <></>
)}

    </div>
  );
};

export default RideDisplay;
