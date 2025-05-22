import React from 'react';
import abt from "../assets/image/abt.jpg";



function About() {
  return (
    <div>
      <div className="container">
        <div className="for_heading_center">
            <h2>About us</h2>
            <h5>this is about us</h5>
        </div>
        <div className="row">
          <div className="col-7 left-about">
            <h1>87% of recruiters say Hire.net simplifies hiring</h1>
            <ul>
                <li>
                Automated candidate screening saves you time reviewing applications, allowing you to focus on meaningful interviews and hiring the right talent efficiently.
                </li>

                <li>
                No more time wasted sorting through unqualified resumes—our smart filtering system does it for you.


                </li>

                <li>
                Custom question library – reuse past interview questions to create new assessments quickly.</li>
            </ul>
          </div>
          <div className="col-5">
            <img className='img-thumbnail' src={abt} alt="About Us" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
