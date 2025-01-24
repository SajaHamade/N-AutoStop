import express from 'express'
import verifyUser from '../middlewares/verifyUser.js';
import AddRide , {SearchForRide , GetRideDetails} from '../Controller/Rides.js';
import fetchLocationName from "../utils/fetchLocationName.js";

const router = express.Router();

router.post('/addRide' , verifyUser , AddRide);

router.post('/searchRide' , SearchForRide );

router.get("/location-name", async (req, res) => {
    const { lat, lng } = req.query;
  
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }
  
    try {
      const locationName = await fetchLocationName(lat, lng);
      res.status(200).json({ locationName });
    } catch (error) {
      console.error("Error fetching location name:", error);
      res.status(500).json({ message: "Failed to fetch location name.", error: error.message });
    }
  });

router.post('/getRide' , GetRideDetails ) ;



export default router ; 