import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchResults.css"; 

const SearchResults = () => {

  const location = useLocation();
  const { rides } = location.state || {}; // Access passed state
  const [drivers, setDrivers] = useState({}); // Store driver details

  // Fetch driver details for each ride
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        //Once all the requests are resolved:The resolved values are stored in the driverDetails array.
        const driverDetails = await Promise.all( //Promise.all is a JavaScript method that takes an array of promises and runs them concurrently. It waits for all of the promises to resolve (or for one to reject) before continuing. If any of the promises fail, Promise.all rejects the entire process.
          rides.map(async (ride) => { 
       
            const response = await axios.post("http://localhost:3000/users/getUser", {
              id: ride.DriverId,
            });
           
            return { driverId: ride.DriverId, user: response.data.user };
          })
        );
        // Convert array to an object for easy lookup
        const driversMap = driverDetails.reduce((acc, curr) => {
          acc[curr.driverId] = curr.user;
          return acc;
        }, {});
        setDrivers(driversMap);
      } catch (error) {
        console.error("Error fetching driver details:", error);
      }
    };

    if (rides && rides.length > 0) {
      fetchDrivers();
    }
  }, [rides]);

  if (!rides || rides.length === 0) {
    return <div>No matching rides found!</div>;
  }

  return (
    <div className="search-results">
      <h2>Matching Rides</h2>
      <div className="rides-container">
        {rides.map((ride ) => {
          const driver = drivers[ride.DriverId];
          return (
            <Link  to={`/displayRide/${ride._id}`} className="ride-link" key={ride._id}>
            <div className="ride-card">
              {driver ? (
                <div className="driver-info">
                  <img
                    src={`http://localhost:3000/images/${driver.profilePicture}`}
                    alt={`${driver.username}'s profile`}
                    className="driver-image"
                  />
                  <p className="driver-username">{driver.username}</p>
                </div>
              ) : (
                <p>Loading driver details...</p>
              )}
              <div className="ride-details">
                <p>
                  <strong>Leaving from :</strong> {ride.source.name}
                </p>
                <p>
                  <strong>Going to:</strong> {ride.destination.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(ride.ScheduledDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Pickup Time:</strong>{" "}
                  {new Date(ride.pickupTime).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Price per Km:</strong> ${ride.PricePerSeat}
                </p>
              </div>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
