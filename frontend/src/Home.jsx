import React from 'react'
import SearchBar from './Pages/Search/SerachBar/SearchBar'

const Home = () => {
  return (
    <div>
      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '20px' , marginTop:'20px' }}>Search for A Ride:</p>
      
      <SearchBar />
    </div>
  )
}

export default Home
