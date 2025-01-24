import React, { createContext, useState, useContext, useEffect } from "react";


//when i will send the request i will extract the DriverId from the token

const RideContext = createContext();





export const RideProvider = ({ children }) => {
  const [rideDetails, setRideDetails] = useState({
    source: null,
    destination: null,
    route: [],
    date: null,
    pickupTime: null,
    NumberOfPassengers : null ,
    luggage : null ,
    pets : null ,
    Smoking : null ,
    StopOver : null ,
    PricePerSeat : null ,
  });

  const updateRideDetails = (key, value) => {
    setRideDetails((prev) => ({ ...prev, [key]: value }));
   
  };

  const [searchDetails , setSearchDetails] = useState({
    source : null ,
    destination : null 
  }
);
  const updateSearchDetails = (key, value) => {
    setSearchDetails((prev) => ({ ...prev, [key]: value }));
   
  };

  const resetRideDetails = () => {
    setRideDetails({
      source: null,
      destination: null,
      route: [],
      date: null,
      pickupTime: null,
      NumberOfPassengers: null,
      luggage: null,
      pets: null,
      Smoking: null,
      StopOver: null,
      PricePerSeat: null,
    });
  }; 
  

  useEffect(() => {
    console.log("Updated RideDetails:", rideDetails);
  }, [rideDetails]);

  useEffect(() => {
    console.log("Updated Search Details:", searchDetails);
  }, [searchDetails]);
  
  return (
    <RideContext.Provider value={{ rideDetails,
                                updateRideDetails , 
                                resetRideDetails , 
                                searchDetails ,
                                updateSearchDetails }}>
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => useContext(RideContext);
