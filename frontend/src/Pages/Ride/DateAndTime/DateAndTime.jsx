import React, { useState } from 'react';
import { useRide } from "../../../Context/RideContext";
import './DateAndTime.css'
import { useNavigate } from 'react-router-dom';

const DateAndTime = () => {
    const navigate = useNavigate();
  const {  updateRideDetails } = useRide();
  const [dateAndpickupTime, setDateAndpickupTime] = useState({
    date: null,
    pickupTime: null,
  });

  const chooseDateAndpickupTime = (key, value) => {
    setDateAndpickupTime((prev) => ({ ...prev, [key]: value }));
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = () => {
    if(dateAndpickupTime.date && dateAndpickupTime.pickupTime){  console.log("Selected date:", dateAndpickupTime.date);
    console.log("Selected pickupTime:", dateAndpickupTime.pickupTime);
    updateRideDetails("date", dateAndpickupTime.date);
    updateRideDetails("pickupTime", dateAndpickupTime.pickupTime);

    navigate('/NumberOfPassengers')} 
    else {
      alert ('Please Choose A Date and A PickUpTime for your Ride ')
    }
  };

  return (
    <div className='date-time-container'>
      <h2>Select The Date and Pick-Up pickupTime of Your Ride</h2>
      <input
        type="date"
        min={today} 
        onChange={(e) => chooseDateAndpickupTime("date", e.target.value)}
      />
      <input
        type="time"
        onChange={(e) => chooseDateAndpickupTime("pickupTime", e.target.value)}
      />
      <button type="submit" onClick={handleSubmit}>
       Submit Date And Time
      </button>
    </div>
  );
};

export default DateAndTime;
