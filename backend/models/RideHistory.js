import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema(
    {
      DriverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
  
      RideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true,
        index: true,
      },
  
      source: {
        name: { type: String, required: true },
        coordinates: {
          type: [Number],
          required: true,
          
        },
      },
  
      destination: {
        name: { type: String, required: true },
        coordinates: {
          type: [Number],
          required: true,
        },
      },

      PassengerSource :  {
        name: { type: String, required: true },
      coordinates: {
        type: [Number],
        required: true,
        
      },
    },

    PassengerDestination :  {
      name: { type: String, required: true },
    coordinates: {
      type: [Number],
      required: true,
      
    },
  },
  
      PassengerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },

        PassengerCost:{
          type : Number ,
          required : true ,
        },
      
  
      rideDate: {
        type: Date,
        required: true,
      },

      rideTime : {
        type: Date,
        required: true,
      },
  
      feedback: [
        {
          UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          message: { type: String }, 
          rating: { type: Number, required: true, min: 1, max: 5 }, 
          createdAt: { type: Date, default: Date.now }, 
        },
      ],
      
    },
    { timestamps: true }
  );
  
  const HistoryModel = mongoose.model('RidesHistory', HistorySchema);
  export default HistoryModel;
  