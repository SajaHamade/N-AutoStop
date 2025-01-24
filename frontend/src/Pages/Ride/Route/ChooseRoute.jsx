import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import L from "leaflet";
import { useRide } from "../../../Context/RideContext";
import './ChooseRoute.css'
import { useNavigate } from "react-router-dom";



  
const RoutingControl = ({ source, destination, showAlternatives, onSubmit , setRoute}) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  useEffect(() => {
    if (!source || !destination) return;
    console.log('showAlternative value' , showAlternatives)

    // Initialize routing control
    const newRoutingControl = L.Routing.control({
      waypoints: [
        L.latLng(source.lat, source.lng),
        L.latLng(destination.lat, destination.lng),
      ],
      routeWhileDragging: true,
      showAlternatives: true, // Toggle alternatives
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      altLineOptions: {
        styles: [{ color: "green", weight: 4, dashArray: "5, 10" }],
      },
    }).addTo(map);

    // On route found
    newRoutingControl.on("routesfound", (e) => {
      const mainRoute = e.routes[0];
      const coordinates = mainRoute.coordinates.map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      }));
      const routeDetails = {
        source: { coordinates: source },
        destination: { coordinates: destination },
        route: coordinates,
      };
      console.log("Route Details:", routeDetails);
      setRoute(routeDetails.route);
   
    });

    routingControlRef.current = newRoutingControl;

    return () => {
    };
  }, [map, source, destination, showAlternatives, onSubmit]);

  return null;
};

const ChooseRoute = () => {
  const navigate = useNavigate();
  const { rideDetails, updateRideDetails } = useRide();
  const source = rideDetails.source;
  const destination = rideDetails.destination;
  const [route , setRoute]=useState([]);

  //const [showAlternatives, setShowAlternatives] = useState(false);

/*   const handleChooseAnotherRoute = () => {
    setShowAlternatives(!showAlternatives);
  }; */

   const handleSubmitRoute = () => {
    console.log("Submitted Route:", route);
   updateRideDetails("route", route);
   navigate('/DateAndTime');

  }; 

  return (
    <div className="container">
      {/* Button Container */}
      <div className="button-container">
{/*         <button
          onClick={handleChooseAnotherRoute}
          className="floating-button"
        >
          Choose Another Route
        </button> */}
        <button
          onClick={handleSubmitRoute}
          className="Submit-button"
        >
          Submit Route
        </button>
      </div>

      {/* Map */}
      <div className="map-wrapper">
        <MapContainer
          center={[33.8938, 35.5018]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {source && destination ? (
            <RoutingControl
              source={source}
              destination={destination}
              setRoute = {setRoute}
             // showAlternatives={showAlternatives}
             // onSubmit={handleSubmitRoute}
            />
          ) : (
            alert("You need to specify your source and destination to complete this step")
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ChooseRoute;
