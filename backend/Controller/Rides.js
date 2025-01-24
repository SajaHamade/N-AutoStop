
import RideModel from "../models/Drive.js";
import fetchLocationName from "../utils/fetchLocationName.js";
import * as turf from "@turf/turf";

const AddRide = async (req, res) => {
  try {
    const {
      source,
      destination,
      route,
      StopOver,
      date,
      pickupTime,
      NumberOfPassengers,
      luggage,
      PricePerSeat,
      pets,
      Smoking,
    } = req.body;

    
    const DriverId = req.user.id; // From verifyUser middleware

    // Fetch location names
    const sourceName = await fetchLocationName(source.lat, source.lng);
    const destinationName = await fetchLocationName(destination.lat, destination.lng);

    const newRide = new RideModel({
      DriverId,
      source: {
        name: sourceName,
        coordinates: [source.lat, source.lng],
      },
      destination: {
        name: destinationName,
        coordinates: [destination.lat, destination.lng],
      },
      route: route.map(({ lat, lng }) => ({ lat, lng })),
      StopOver,
      ScheduledDate: new Date(date),
      pickupTime: new Date(`${date}T${pickupTime}`),
      NumberOfPassengers: Number(NumberOfPassengers),
      Luggage: luggage,
      PricePerSeat: Number(PricePerSeat),
      PetsAllowed: pets,
      SmokingAllowed: Smoking,
    });

    await newRide.save();

    res.status(201).json({
      message: "Ride added successfully!",
      ride: newRide,
    });
  } catch (error) {
    console.error("Error adding ride:", error);
    res.status(500).json({ message: "Failed to add ride.", error: error.message });
  }
};


export async function SearchForRide(req, res) {
  try {
    const destination = req.body.goingLocation; // { lat, lng }
    const source = req.body.leavingLocation; // { lat, lng }
    const date = req.body.date;

    console.log("in the backend : source:", source, "destination:", destination, "date:", date);

    if (!source || !destination || !date) {
      return res.status(400).json({ msg: "Missing Search fields" });
    }

    // Find rides scheduled on the provided date
    const rides = await RideModel.find({ ScheduledDate: date });

    if (!rides || rides.length === 0) {
      return res.status(201).json({
        message: "No Rides matching your day",
      });
    }

    const matchedRides = []; // Array to store matched rides
    const bufferDistance = 2; // Buffer distance in kilometers

    rides.forEach((ride) => {
      if (ride.NumberOfPassengers <= 0) {
        return; // Skip this ride if the NumberOfPassengers is less than or equal to 0
      }
      const rideSource = ride.source.coordinates; // [lat, lng]
      const rideDestination = ride.destination.coordinates; // [lat, lng]
      const routePoints = ride.route.map((point) => [point.lng, point.lat]); // Convert route to [lng, lat] because turf.js use this format it cannot use the lat , lng format

      // Create a LineString from the route
      const routeLine = turf.lineString(routePoints);

      // Create a buffer around the route
      const bufferedRoute = turf.buffer(routeLine, bufferDistance, { units: "kilometers" });

      // Check if source or destination points are within the buffer
      const isSourceNearRoute = turf.booleanPointInPolygon(
        turf.point([source.lng, source.lat]),
        bufferedRoute
      );
      const isDestinationNearRoute = turf.booleanPointInPolygon(
        turf.point([destination.lng, destination.lat]),
        bufferedRoute
      );

      if (ride.StopOver) {
        // Check if source and destination are near the buffered route
        if (isSourceNearRoute && isDestinationNearRoute) {
          matchedRides.push(ride);
        }
      } else {
        // Check if ride's source and destination match exactly
        if (
          rideSource[0] === source.lat &&
          rideSource[1] === source.lng &&
          rideDestination[0] === destination.lat &&
          rideDestination[1] === destination.lng
        ) {
          matchedRides.push(ride);
        }
      }
    });

    if (matchedRides.length === 0) {
      return res.status(201).json({
        message: "No matching rides found",
      });
    }

    // Return matched rides
    return res.status(200).json({
      message: "Rides matching your search",
      rides: matchedRides,
    });
  } catch (error) {
    console.error("Error searching for a ride:", error);
    return res.status(500).json({
      message: "Failed to search for a ride.",
      error: error.message,
    });
  }
}

export async function GetRideDetails(req, res) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "Ride ID is required" });
    }


    const ride = await RideModel.findById(id);
    if (!ride) {
      return res.status(404).json({ msg: "ride not found" });
    }

    return res.status(200).json({ msg: "Ride fetched successfully", ride });
  } catch (error) {
    console.error("Error fetching ride details:", error.message);
    return res.status(500).json({ msg: "Internal server error" });
  }
}















export default AddRide;
