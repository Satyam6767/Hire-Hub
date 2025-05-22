import React from 'react'
import Hire from '../assets/image/HIRE (1).png'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div>
      <div className="container-fluid footer-n">
        <div className="container">
            <div className="row">
                <div className="col-md-4 link-col-123">
                <Link  to="/"> <img className='nav_img' src={Hire} /></Link>
                <p>HireHub is a smart hiring platform connecting employers with skilled professionals</p>
                </div>

                <div className="col-md-4 link-col-123">
                    <Link to="">Home</Link>
                    <Link to="" >About</Link>
                    <Link to="">Contact</Link>
                    <Link to=" ">Login</Link>
                </div>

                <div className="col-md-4 link-col-123">
                    <p><strong>Location :- </strong>Wakad , pune</p>
                    <p><strong>Email :- </strong>hirehub@gmail.com</p>
                    <p><strong>Phone :- </strong>9876543215</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
