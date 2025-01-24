# N-Auto Stop
This is a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). 

#Idea 
N-Auto Stop makes transportation easier and more affordable. 
Instead of traditional taxis, this platform allows regular drivers (ordinary people traveling from one place to another) to pick up passengers along their route upon request. 
Passengers share the cost of the ride with the driver, making it a cost-effective solution for both parties.
Passengers can request rides that match their starting point and destination.

## Technologies Used
This project leverages the following technologies and libraries:  
- **Frontend:** React.js (with Vite)  
- **Backend:** Node.js, Express.js, MongoDB  
- **Mapping and Geospatial Analysis:**  
  - **Leaflet.js**: Used for interactive maps and displaying locations.  
  - **Turf.js**: Used for geospatial operations such as buffering and distance calculations.  


## Features
- User authentication and authorization
- Publishing A ride
- Searching For A ride
- Requesting a ride
- Accepting A request
- Viewing the Status of a request
- Viewing the History of your Rides
- Rating a Ride and providing a feedback


### Steps
 1:Clone the repository:
   git clone https://github.com/SajaHamade/N-AutoStop.git

2:Navigate to the project directory:
cd N-AutoStop

3:Install dependencies for the backend: 
cd backend
npm install

4:Install dependencies for the frontend:
cd frontend
npm install


5: Start the backend server 
   cd backend
   npm start 
PS:
Add the following to your .env file:
PORT: The port number the backend will run on.
MONGODB_URL: Your MongoDB connection string.
JWT_KEY: Your secret key for JWT authentication.

If successful, you should see the following messages in the console: Server is running Connected to MongoDB
                                                              

6:Start the frontend 
    cd frontend
    npm start 
    npm run dev (built with Vite)
    

---Check out the videos included in this repository for a quick overview of the project's functionality.---

