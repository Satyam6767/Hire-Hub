import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import About from '../components/About'
import Message from '../components/Message'
import Footer from '../components/Footer'


function Homepage() {
  return (
    <div>
      <Navbar />
      <Banner />
      <About />
      <Message />
      <Footer />
    </div>
  )
}

export default Homepage
