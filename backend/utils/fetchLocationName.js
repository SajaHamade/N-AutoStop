import axios from "axios";

const fetchLocationName = async (lat, lng) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon: lng,
        format: "json",
      },
    });
    return response.data.display_name || "Unknown Location";
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Error fetching location";
  }
};

export default fetchLocationName;
