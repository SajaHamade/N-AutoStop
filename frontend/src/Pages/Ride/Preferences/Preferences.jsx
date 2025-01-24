import React, { useState } from "react";
import "./Preferences.css";
import { useRide } from "../../../Context/RideContext";
import { useNavigate } from "react-router-dom";

const Preferences = () => {
  const { updateRideDetails } = useRide();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    Smoking: false,
    pets: false,
    luggage: "Small", // Small, Medium, Large
    StopOver: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission process

  const handlePreferenceChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true); // Start the submission process
    console.log("Ride Preferences:", preferences);

    // Update context values
    updateRideDetails("luggage", preferences.luggage);
    updateRideDetails("pets", preferences.pets);
    updateRideDetails("Smoking", preferences.Smoking);
    updateRideDetails("StopOver", preferences.StopOver);

    // Wait for a short delay to ensure context is updated
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/summary");
    }, 100); // Adjust delay if necessary
  };

  return (
    <div className="preferences-container">
      <h2>Set Your Ride Preferences</h2>

      <div className="preference-item">
        <label>
          <input
            type="checkbox"
            checked={preferences.Smoking}
            onChange={(e) => handlePreferenceChange("Smoking", e.target.checked)}
          />
          Smoking Allowed
        </label>
      </div>

      <div className="preference-item">
        <label>
          <input
            type="checkbox"
            checked={preferences.pets}
            onChange={(e) => handlePreferenceChange("pets", e.target.checked)}
          />
          Pets Allowed
        </label>
      </div>

      <div className="preference-item">
        <label>
          Luggage Size:
          <select
            value={preferences.luggage}
            onChange={(e) => handlePreferenceChange("luggage", e.target.value)}
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </label>
      </div>

      <div className="preference-item">
        <label>
          <input
            type="checkbox"
            checked={preferences.StopOver}
            onChange={(e) =>
              handlePreferenceChange("StopOver", e.target.checked)
            }
          />
          StopOver to Pick Up a Passenger
        </label>
      </div>

      <button
        onClick={handleSubmit}
        className="submit-button"
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
};

export default Preferences;
