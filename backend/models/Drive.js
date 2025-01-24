import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema(
  {
    DriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },

    source: {
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true }, 
    },

    destination: {
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true },
    },

    route: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ], 

    StopOver: {
      type: Boolean,  
      required: true,
    },

    ScheduledDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: Date,
      required: true,
    },

    NumberOfPassengers: {
      type: Number,
      required: true,
      
    },

    Luggage: {
      type: String,  
      required: true,
    },

    PricePerSeat: {
      type: Number,
      required: true,
      min: [0, 'Price per seat must be a positive value.'], 
    },

    PetsAllowed: {
      type: Boolean,  
      required: true,
    },

    SmokingAllowed: {
      type: Boolean, 
      required: true,
    },
  },
  { timestamps: true } 
);

const RidesModel = mongoose.model('Ride', RideSchema);
export default RidesModel;
