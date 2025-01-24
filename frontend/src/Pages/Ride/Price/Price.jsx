import React, { useState } from 'react'
import { useRide } from '../../../Context/RideContext'
import './Price.css'
import { useNavigate } from 'react-router-dom'


const Price = () => {
  const navigate = useNavigate();
  const {updateRideDetails} = useRide();
    const [number , setNumber] = useState();

    const handleSubmit = () => {
    if(number<0.1){alert("please enter a valid price")}
     updateRideDetails("PricePerSeat", number);
     navigate('/preferences')
    }
  return (
    <div className="passenger-container">
        <h1>Set Your Price Per Kilometer</h1>
        <input
        type="number"
        min = "0.1" 
        onChange = {(e)=>{setNumber(e.target.value)}}
        />
        <button onClick={handleSubmit}>Submit</button>
      
    </div>
  )
}

export default Price
