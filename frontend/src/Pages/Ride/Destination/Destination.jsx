import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom' ;
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import './Destination.css';
import { useRide } from "../../../Context/RideContext";


const Destination = () => {
   const navigate = useNavigate();
  const { updateRideDetails } = useRide();
  const [showGeocoder, setShowGeocoder] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [position, setPosition] = useState(null);

  // Detect user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error detecting location:", error.message);
          setPosition([33.8938, 35.5018]); // Default to Beirut
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPosition([33.8938, 35.5018]); // Default to Beirut
    }
  }, []);

  // Geocoder for searching for a location 
  function GeocoderControl({ onSearchLocation, showGeocoder }) {
    const map = useMap();

    useEffect(() => {
      let geocoder = null;

      if (showGeocoder) {
        geocoder = L.Control.geocoder({
          defaultMarkGeocode: true,
          collapsed: false,
        }).addTo(map);

        geocoder.on("markgeocode", function (e) {
          const { bbox, center } = e.geocode;
          map.fitBounds(bbox);
          onSearchLocation(center);
        });
      }

      return () => {
        if (geocoder) {
          map.removeControl(geocoder);
        }
      };
    }, [map, onSearchLocation, showGeocoder]);

    return null;
  }

  const handleButtonClick = () => {
    setShowGeocoder(!showGeocoder);
  };

  const handleSubmitButtonClick = () => {
   console.log(searchedLocation,"searchedLocation");
   updateRideDetails("destination", searchedLocation);
   navigate('/ChooseRoute')
  };

  return (
    <div className="container">
      <div className="map-wrapper">
        {position ? (
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>Your Current Location</Popup>
            </Marker>
            <GeocoderControl
              onSearchLocation={setSearchedLocation}
              showGeocoder={showGeocoder}
            />
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

<div>
     {searchedLocation? (
    <button onClick={handleButtonClick} className="floating-button-NotActive">
        Choose Your Destination
      </button>) :
     ( <button onClick={handleButtonClick} className="floating-button-active">
        Choose Your Distination
      </button>)}
      
      {searchedLocation?(
        <button onClick={handleSubmitButtonClick} className="submit-button">
        Submit Location </button>) : (
            <p></p> )}
      
</div>
    </div>
  );
};

export default Destination;
