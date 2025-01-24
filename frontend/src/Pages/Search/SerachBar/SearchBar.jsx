import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios"; // Make sure axios is imported
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "./SearchBar.css";
import { useNavigate } from "react-router-dom";
import { useRide } from "../../../Context/RideContext";


const SearchBar = () => {

  const navigate = useNavigate() ;

  const [showMapForLeaving, setShowMapForLeaving] = useState(false);
  const [showMapForGoing, setShowMapForGoing] = useState(false);
  const [leavingLocation, setLeavingLocation] = useState(null);
  const [goingLocation, setGoingLocation] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [leavingLocationName, setLeavingLocationName] = useState(null);
  const [goingLocationName, setGoingLocationName] = useState(null);
  const [date , setDate] = useState(null) ;

  const {updateSearchDetails} = useRide();


const navigateToResults = (results)=>{
  navigate("/searchResults", { state: { rides: results } });
}

  const today = new Date().toISOString().split("T")[0];


  const fetchLocationNameFromBackend = async (lat, lng) => {
    try {
      const response = await axios.get("http://localhost:3000/rides/location-name", {
        params: { lat, lng },
      });
      return response.data.locationName;
    } catch (error) {
      console.error("Error fetching location name from backend:", error);
      return "Unknown Location"; // Default error handling
    }
  };


  const SubmitSearch= async() =>  {
    console.log('source:',leavingLocation , 'destination:', goingLocation, 'date:', date);

    try {
        const response = await axios.post("http://localhost:3000/rides/searchRide" ,
           { goingLocation , leavingLocation , date }
        )

        if(response.data.message === 'No Rides matching your day'){
           return alert("No rides matching your day");
        }


        if(response.data.message === 'No matching rides found'){
           return alert("No matching rides found")
        } 

        if(response.data.rides){ //if the search returned matching rides
          updateSearchDetails('source' , leavingLocation);
          updateSearchDetails('destination' , goingLocation);
          navigateToResults(response.data.rides);
        }


        
    } catch (error) {
        console.log(error)
        
    }
    
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error detecting location:", error.message);
          setCurrentPosition([33.8938, 35.5018]); // Default to Beirut
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setCurrentPosition([33.8938, 35.5018]); // Default to Beirut
    }
  }, []);

  useEffect(() => {
    // Fetch location name when leavingLocation changes
    if (leavingLocation) {
      fetchLocationNameFromBackend(leavingLocation.lat, leavingLocation.lng).then(setLeavingLocationName);
    }
  }, [leavingLocation]);

  useEffect(() => {
    // Fetch location name when goingLocation changes
    if (goingLocation) {
      fetchLocationNameFromBackend(goingLocation.lat, goingLocation.lng).then(setGoingLocationName);
    }
  }, [goingLocation]);

  // Geocoder for searching
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

  const toggleLeavingMap = () => {
    setShowMapForLeaving(!showMapForLeaving);
    setShowMapForGoing(false);
  };

  const toggleGoingMap = () => {
    setShowMapForGoing(!showMapForGoing);
    setShowMapForLeaving(false);
  };

  return (
    <div className="search-bar-container">
      <div className="search-field">
        <button onClick={toggleLeavingMap} className="search-button">
          {leavingLocationName ? `Leaving from: ${leavingLocationName}` : "Leaving from"}
        </button>
      </div>

      {showMapForLeaving && currentPosition && (
        <div className="map-container">
          <MapContainer
            center={currentPosition}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={currentPosition}>
              <Popup>Your Current Location</Popup>
            </Marker>
            <GeocoderControl
              onSearchLocation={setLeavingLocation}
              showGeocoder={showMapForLeaving}
            />
          </MapContainer>
          <button onClick={toggleLeavingMap} className="close-map-button">
            Submit Location
          </button>
        </div>
      )}


      <div className="search-field">
        <button onClick={toggleGoingMap} className="search-button">
          {goingLocationName ? `Going to: ${goingLocationName}` : "Going to"}
        </button>
      </div>

     
      {showMapForGoing && currentPosition && (
        <div className="map-container">
          <MapContainer
            center={currentPosition}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={currentPosition}>
              <Popup>Your Current Location</Popup>
            </Marker>
            <GeocoderControl
              onSearchLocation={setGoingLocation}
              showGeocoder={showMapForGoing}
            />
          </MapContainer>
          <button onClick={toggleGoingMap} className="close-map-button">
            Submit Location
          </button>
        </div>
      )}

     Date :  <input
        type="date"
        min={today} 
        onChange={(e) =>setDate( e.target.value)}
      />


        <button className='search-button'onClick={SubmitSearch}>Search </button>
    </div>
  );
};

export default SearchBar;
