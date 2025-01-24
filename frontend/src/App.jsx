import {BrowserRouter , Routes , Route} from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import Signup from './Pages/SignUp/Signup'
import Login from './Pages/Login/Login'
import Home from './Home'
import Navbar from './Pages/Navbar/Navbar'
import Source from './Pages/Ride/Source/Source'
import Destination from './Pages/Ride/Destination/Destination'
import ChooseRoute from './Pages/Ride/Route/ChooseRoute'
import DateAndTime from './Pages/Ride/DateAndTime/DateAndTime'
import NumberOfPassengers from './Pages/Ride/NumberOfPassengers/NumberOfPassengers'
import Price from './Pages/Ride/Price/Price'
import Preferences from './Pages/Ride/Preferences/Preferences'
import Summary from './Pages/Ride/Summary/Summary'
import SearchBar from './Pages/Search/SerachBar/SearchBar'
import SearchResults from './Pages/Search/SearchResults/SearchResults'
import RideDisplay from './Pages/RideDisplay/RideDisplay'
import ScheduledRides from './Pages/RequestsDetails/ScheduledRides/ScheduledRides'
import ReceivedRequests from './Pages/RequestsDetails/ReceivedRequests/ReceivedRequests'
import SentRequests from './Pages/RequestsDetails/SentRequests/SentRequests'
import RideHistory from './Pages/RideHistory/RideHistory'
import Feedbacks from './Pages/Feedbacks/Feedbacks'





function App() {


  return (  
 <BrowserRouter>
 <Navbar/>
 <Routes>
  <Route path ='/' element= {<Home/>}> </Route>
  <Route path ='signup' element= {<Signup/>}> </Route>
  <Route path ='login' element= {<Login/>}> </Route>
  <Route path='/source' element={<Source/>}> </Route>
  <Route path='/destination' element={<Destination/>}></Route>
  <Route path='/ChooseRoute' element={<ChooseRoute/>}></Route>
  <Route path='/DateAndTime' element={<DateAndTime/>}></Route>
  <Route path='/NumberOfPassengers' element={<NumberOfPassengers/>}></Route>
  <Route path='/price' element={<Price/>}></Route>
  <Route path='/preferences' element={<Preferences/>}></Route>
  <Route path='/summary' element={<Summary/>}></Route>
  <Route path='/searchBar' element={<SearchBar/>}></Route>
  <Route path='/searchResults' element={<SearchResults/>}></Route>
  <Route path="/displayRide/:rideId" element={<RideDisplay />} />
  <Route path='/upcoming-rides' element={<ScheduledRides/>}/>
  <Route path='/received-requests' element={<ReceivedRequests/>}/>
  <Route path='/sent-requests' element={<SentRequests/>}/>
  <Route path='/history' element={<RideHistory/>}/>
  <Route path='/feedback/:rideId' element={<Feedbacks/>} />

  




 
 </Routes>
 </BrowserRouter>
  )
}

export default App
