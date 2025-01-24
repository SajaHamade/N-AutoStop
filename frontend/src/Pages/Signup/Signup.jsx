import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"; // Import the separate CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    dateOfBirth: "",
    liscenceNumber: "",
    description: "",
    image: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => { //gets an array of keys (field names) from the formData object
      formDataToSend.append(key, formData[key]);//and append each of them in the formDataToSend 
                                                //we made this , because the main formData is not of FormData , and thus it cannot handle files and cnnot be send along the request 
    });

    try {
      const response = await axios.post("http://localhost:3000/users/signup", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response) ;
           if(response.data.msg === 'User saved successfully in the database.') { 
            window.location.href = "/login"; 
          }
     // setMessage(response.data.msg);

    } catch (error) {
      setMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="signup-container">
      <form
        className="signup-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="signup-title">Signup</h2>
        {message && <p className="signup-message">{message}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="liscenceNumber">License Number</label>
          <input
            id="liscenceNumber"
            type="text"
            name="liscenceNumber"
            value={formData.liscenceNumber}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Profile Picture</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="form-button">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
