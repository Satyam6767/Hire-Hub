// PostedJobsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostedJobsPage.css"; // optional custom styling

const PostedJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/my-jobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setJobs(data);
            } catch (err) {
                console.error("Error fetching posted jobs:", err);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="posted-jobs-container">
            <h2>Jobs You Have Posted</h2>
            {jobs.length === 0 ? (
                <p>No jobs posted yet.</p>
            ) : (
                <div className="job-cards">
                    {jobs.map((job) => (
                        <div key={job._id} className="job-card">
                            <h3>{job.title}</h3>
                            <p><strong>Company:</strong> {job.company || "Your Company"}</p>
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Salary:</strong> ₹{job.salary}</p>
                        </div>
                    ))}
                </div>
            )}
            <button onClick={() => navigate(-1)} className="dashboard-btn">Go Back</button>
        </div>
    );
};

export default PostedJobsPage;
