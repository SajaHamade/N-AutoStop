import RequestModel from '../models/Request.js'
import RideModel from '../models/Drive.js'
import HistoryModel from '../models/RideHistory.js';
import mongoose from 'mongoose';


const AddRequest = async (req,res)=> {
   try {
      const {
        DriverId,
        RideId,
        PassengerId,
        PassengerSource,
        PassengerDestination,
        PassengerDistance ,
        PassengerCost,
      } = req.body;  
  
      // Validate required fields
      if (!DriverId || !RideId || !PassengerId || !PassengerSource || !PassengerDestination || !PassengerCost || !PassengerDistance) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new request
      const newRequest = new RequestModel({
        DriverId,
        RideId,
        PassengerId,
        PassengerSource,
        PassengerDestination,
        PassengerCost ,
        PassengerDistance,
        status: 'pending',  // Default to 'pending'
      });
  
      // Save the new request to the database
      await newRequest.save();
  
      // Send a response with the newly created request
      res.status(201).json({
        message: 'Request added successfully',
        request: newRequest,
      });
    } catch (error) {
      console.error('Error adding request:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };



  export async function GetSentRequests(req, res) {
    try {
      const UserId = req.user.id;
  
    
      const requests = await RequestModel.find({ PassengerId: UserId })
        .populate('DriverId', 'username') //Mongoose's population feature to replace the DriverId field (which normally contains an ObjectId referencing the User model) with the corresponding User document's username field
        .exec();
  
      if (requests.length === 0) {
        return res.status(404).json({
          message: 'No requests sent.',
          requests: [],
        });
      }
  
      return res.status(200).json({
        message: 'Requests fetched successfully.',
        requests,
      });
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      return res.status(500).json({
        message: 'An error occurred while fetching requests.',
        error: error.message,
      });
    }
  }
  


  export async function GetReceivedRequests(req, res) {
    try {
      const UserId = req.user.id;
  
   
      const requests = await RequestModel.find({ DriverId: UserId , status:"pending"})
        .populate("PassengerId", "firstName lastName dateOfBirth profilePicture phoneNumber")
        .populate("RideId", "source.name destination.name ScheduledDate"); 
  
      if (requests.length === 0) {
        return res.status(200).json({
          message: "No requests received.",
          requests: [],
        });
      }
  
      return res.status(200).json({
        message: "Requests fetched successfully.",
        requests: requests,
      });
    } catch (error) {
      console.error("Error fetching received requests:", error);
      return res.status(500).json({
        message: "An error occurred while fetching requests.",
        error: error.message,
      });
    }
  }
  


  export async function AcceptRequest(req, res) {
    try {
      const { requestId } = req.body;
  
   
      const request = await RequestModel.findOne({ _id: requestId });
  
      if (!request) {
        return res.status(404).json({
          message: 'Request Not Found',
        });
      }
  
  
      request.status = "accepted";
      await request.save();
  
     
      const ride = await RideModel.findOne({ _id: request.RideId });
  
      if (!ride) {
        return res.status(404).json({
          message: 'Ride Not Found',
        });
      }
  
     
      ride.NumberOfPassengers -= 1;
      await ride.save();
  
  
      const SaveRideHistory = new HistoryModel({
        RideId: ride._id,
        DriverId: ride.DriverId,
        source: {
          name: ride.source.name,
          coordinates: ride.source.coordinates,
        },
        destination: {
          name: ride.destination.name,
          coordinates: ride.destination.coordinates,
        },
        PassengerId: request.PassengerId, 
        PassengerSource: {
          name: request.PassengerSource.name,
          coordinates: request.PassengerSource.coordinates,
        },

        PassengerDestination: {
          name: request.PassengerDestination.name,
          coordinates: request.PassengerDestination.coordinates,
        },

        rideDate: new Date(), 
        rideTime : ride.pickupTime ,
        PassengerCost : request.PassengerCost 
      });
  
      await SaveRideHistory.save(); 
  
      return res.status(200).json({
        message: 'Request accepted and added to history successfully.',
        request,
      });
    } catch (error) {
      console.error('Error accepting request:', error);
      return res.status(500).json({
        message: 'An error occurred while accepting the request.',
        error: error.message,
      });
    }
  }


  export async function DenyRequest(req,res) {
    try{

      const { requestId } = req.body;


      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        console.error("Invalid RequestId:", requestId);
        return res.status(400).json({ message: "Invalid RequestId." });
      }
      
  
   
      const request = await RequestModel.findOne({ _id:requestId });
  
      if (!request) {
        return res.status(404).json({
          message: 'Request Not Found',
        });
      }
  
  
      request.status = "denied";
      await request.save();

      
      return res.status(200).json({
        message: 'Request Denied successfully.',
      });

    }catch(err){
      console.log("Error Denying Request", err);
      return res.status(500).json({
        message: 'An error occurred while denying the request.',
        error: err.message,
      });
    }
    
  }


  export async function GetScheduledRides(req,res) {
    const UserId = req.user.id;

    try {
      const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const response = await HistoryModel.find({
      $and: [
        {
          $or: [
            { DriverId: UserId },
            { PassengerId: UserId} ,
          ],
        },
        { rideDate: { $gte: today } },
      ],
    }).populate('DriverId', 'username') 
    .populate('PassengerId', 'username');

    if(!response){
      return res.status(404).json({
        message: 'No Upcoming Rides',
      });
    }

      return res.status(200).json({
        message: 'Upcoming Rides fetched Successfully.',
        response,
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'An error occurred while fetching upcoming rides.',
        error: error.message,
      });

      
    }

    

    }


export async function GetOldRides(req,res) {
    const UserId = req.user.id;

    try {
      const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const response = await HistoryModel.find({
      $and: [
        {
          $or: [
            { DriverId: UserId },
            { PassengerId: UserId} ,
          ],
        },
        { rideDate: { $lt: today } },
      ],
    }).populate('DriverId', 'username') 
    .populate('PassengerId', 'username');

    if (response.length === 0) {
      return res.status(404).json({
        message: 'No old Rides',
      });
    }
    
      return res.status(200).json({
        message: 'old Rides fetched Successfully.',
        response,
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'An error occurred while fetching old rides.',
        error: error.message,
      });

      
    }

    

    }




    export const submitFeedback = async (req, res) => {
      const { rideId } = req.params;  
      const { rating, feedback} = req.body;  
      const userId = req.user.id;


      console.log(rideId , rating , feedback , userId)
    
      
      if (!rating || !feedback || !userId) {
        return res.status(400).json({ message: 'Rating, feedback, and userId are required.' });
      }
    
      try {

        const rideHistory = await HistoryModel.findOne({
          _id : rideId
        });


    
        if (!rideHistory) {
          return res.status(404).json({ message: 'Ride not found.' });
        }

        console.log("ride found in history")
    
        // Check if the user has already left feedback
        const existingFeedback = rideHistory.feedback.find((f) => f.UserId.toString() === userId);
    
        if (existingFeedback) {
          return res.status(404).json({ message: 'User already added a feedback.' });
        } else {
          rideHistory.feedback.push({
            UserId: userId,
            rating:rating,
            message: feedback,
            createdAt: Date.now(),
          });
        }
    
       
        await rideHistory.save();
    
       
        return res.status(200).json({ message: 'Feedback submitted successfully.' });
    
      } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({ message: 'An error occurred while submitting feedback.', error: error.message });
      }
    };
    



    export async function GetFeedbacks(req, res) {
      try {
          const { rideId } = req.params;
          const userId = req.user.id;

          console.log('UserId' , userId , 
            'ride Id :' ,rideId 
          )
  
          if (!rideId || !userId) {
              return res.status(400).json({ message: 'Ride ID and User ID are required.' });
          }
  
          // Fetch ride from the database
          const Ride = await HistoryModel.findOne({_id : rideId });
          if (!Ride) {
              return res.status(404).json({ message: 'Ride not found.' });
          }
  
          // Ensure feedback array exists
          if (!Array.isArray(Ride.feedback)) {
              return res.status(400).json({ message: 'No feedback available for this ride.' });
          }
  
          const feedback = Ride.feedback.filter((f) => f.UserId != userId); 
          const userFeedback = Ride.feedback.find((f) => f.UserId.toString() === userId);
  
          // If user already added feedback
          if (userFeedback) {
              return res.status(200).json({ 
                  message: 'User already added feedback.', 
                  feedback 
              });
          }

         
          return res.status(200).json({ 
              message: 'User Did not add a feedback ,Feedbacks fetched successfully.', 
              feedback 
          });
  
      } catch (error) {
          console.error('Error fetching feedbacks:', error);
          return res.status(500).json({ message: 'Error fetching feedbacks.' });
      }
  }
  
    
  
  


  



export default AddRequest ;