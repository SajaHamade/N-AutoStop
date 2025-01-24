import React, { useState } from 'react'
import { useRide } from '../../../Context/RideContext'
import './NumberOfPassengers.css'
import { useNavigate } from 'react-router-dom'


const NumberOfPassengers = () => {
    const {updateRideDetails} = useRide();
    const [number , setNumber] = useState();
    const navigate = useNavigate();

    const handleSubmit = () => {
    if(number<1){alert("please enter a valid number of passengers"); return }
     console.log(number,"number of passengers");
     updateRideDetails("NumberOfPassengers", number);
     navigate('/price');

    }
  return (
    <div className="passenger-container">
        <h1>So How many Passengers can you take ?</h1>
        <input
        type="number"
        min = "1" 
        onChange = {(e)=>{setNumber(e.target.value)}}
        />
        <button onClick={handleSubmit}>Submit</button>
      
    </div>
  )
}

export default NumberOfPassengers
