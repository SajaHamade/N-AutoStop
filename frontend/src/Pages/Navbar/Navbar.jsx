import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:3000/users/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
          setIsLoggedIn(true);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Nauto Stop
          </Link>
          <div className="navbar-actions">
            {isLoggedIn ? (
              <Link to="/source" className="navbar-button publish-ride">
                Publish a Ride
              </Link>
            ) : (
             <> 
            
               <Link to="/login" className="navbar-button publish-ride">
                Publish a Ride
              </Link>
              
             </> 
            )}
            {isLoggedIn ? (
            <>  <div className="navbar-profile-container">
                <div className="navbar-profile" onClick={toggleSidebar}>
                  <span className="navbar-username">{user.username}</span>
                  <img
                    src={
                      `http://localhost:3000/images/${user.profilePicture}` ||
                      "/default-profile.png"
                    }
                    alt="Profile"
                    className="navbar-profile-image"
                  />
                </div>
                {isSidebarOpen && (
                  <div className="sidebar">
                    <div className="sidebar-header">
                      <button
                        className="close-sidebar"
                        onClick={closeSidebar}
                      >
                        &times;
                      </button>
                    </div>
                    <div className="sidebar-links">
                      <Link to="/sent-requests" onClick={closeSidebar}>
                        Sent Requests
                      </Link>
                      <Link to="/received-requests" onClick={closeSidebar}>
                        Received Requests
                      </Link>
                      <Link to="/upcoming-rides" onClick={closeSidebar}>
                        Upcoming Rides
                      </Link>
                      <Link to="/history" onClick={closeSidebar}>
                        Earlier Rides and Feedbacks
                      </Link>
                    </div>
                  </div>
                )}
              </div>
               <button onClick={handleLogout}>
               Logout </button>
               </>
            ) : (
              <Link to="/login" className="navbar-button login">
                Signup/Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
