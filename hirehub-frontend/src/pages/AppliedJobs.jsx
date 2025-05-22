import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../styles/AppliedJobs.css";

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchApplications = async () => {
            if (!token) {
                setError("Please log in to view your applied jobs.");
                setLoading(false);
                return;
            }

            try {
                // Adjust URL if your route is different
                const response = await axios.get("http://localhost:5000/api/applications/my-applications", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Fetched applications:", response.data);
                setApplications(response.data);
            } catch (error) {
                console.error("Error fetching applications:", error.response?.data || error.message);
                setError("Failed to load applied jobs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [token]);

    return (
        <div>
            <Navbar />
            <h2>Applied Jobs</h2>

            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : applications.length === 0 ? (
                <p className="empty-state">You haven't applied for any jobs yet.</p>
            ) : (
                <ul>
                    {applications.map(({ _id, job, status }) => (
                        <li key={_id}>
                            <h3>{job?.title} - {job?.company}</h3>
                            <p>{job?.description}</p>
                            <p><strong>Location:</strong> {job?.location}</p>
                            <p><strong>Salary:</strong> {job?.salary || "Not disclosed"}</p>
                            <p><strong>Application Status:</strong> {status}</p>
                            <p><strong>Posted by:</strong> {job?.employerId?.name || "Unknown"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppliedJobs;
