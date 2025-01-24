import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema(
  {
    DriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },

    RideId: {  // Changed DriveId to RideId for clarity
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true, 
    },

    PassengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },

    PassengerSource: {
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true },
    },

    PassengerDestination: {  
      name: { type: String, required: true },
      coordinates: { type: [Number], required: true },
    },

    PassengerDistance : {
      type : Number ,
      required : true ,
    },

    PassengerCost : {
      type : Number ,
      required : true ,
    },



    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'denied'], 
      default: 'pending'
    }
  },
  { timestamps: true } 
);


const RequestModel = mongoose.model('Request', RequestSchema);
export default RequestModel;
