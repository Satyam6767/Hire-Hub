import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // fixed import here
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";


const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    useEffect(() => {
        const fetchEmployerJobs = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch("http://localhost:5000/api/jobs/my-jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Failed to fetch employer jobs", err);
            }
        };

        if (user?.role === "employer") {
            fetchEmployerJobs();
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <>
            <Navbar />
            <div className="dashboard-container">
                {!user ? (
                    <div className="guest-dashboard">
                        <h2>Welcome to the Job Portal</h2>
                        <Link to="/login" className="dashboard-link">Login</Link> |
                        <Link to="/register" className="dashboard-link">Register</Link>
                    </div>
                ) : (
                    <div className="user-dashboard">
                        <h3 className="welcome-message">Welcome, {user.name}!</h3>
                        <h4 className="user-role">Role: {user.role}</h4>

                        {user.role === "employer" ? (
                            <div className="dashboard-actions">
                                <Link to="/post-job" className="dashboard-btn">Post a Job</Link>
                                <Link to="/my-posted-jobs" className="dashboard-btn">Total Jobs Posted</Link>

                                {jobs.map((job) => (
                                    <div key={job._id} className="job-card">
                                        <p>Job Title: <strong>{job.title}</strong></p>
                                        <Link
                                            to={`/jobs/${job._id}/applicants`}
                                            className="dashboard-btn"
                                        >
                                            View Applicants
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="dashboard-actions">
                                <Link to="/view-jobs" className="dashboard-btn">View Available Jobs</Link>
                                <Link to="/applied-jobs" className="dashboard-btn">Already Applied Jobs</Link>
                            </div>
                        )}
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;
