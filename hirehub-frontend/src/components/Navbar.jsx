import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../nav.css'; 
import Hire from '../assets/image/HIRE (1).png'

const Navbar = () => {
  const navigate = useNavigate();

  // Directly read the token from localStorage
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav >
      <Link  to="/"> <img className='nav_img' src={Hire} /></Link>
      {token ? (
        // If a token exists, show the logout button
        <button onClick={handleLogout}>Logout</button>
      ) : (
        // Otherwise, show the Login and Register links
        <div className='nav_items'>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
