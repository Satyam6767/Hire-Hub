import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/JobApplicants.css";

const JobApplicants = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchApplicants = async () => {
            if (!token) {
                alert("Please log in to view applicants.");
                navigate("/login");
                return;
            }

            try {
                console.log("Fetching applicants for Job ID:", jobId); // Debug log

                const response = await axios.get(`http://localhost:5000/api/applications/${jobId}/applicants`, {
                    headers: { Authorization: token }
                });
                

                console.log("API Response:", response.data); // Debug log
                setApplicants(response.data);
            } catch (error) {
                console.error("Error fetching applicants:", error.response?.data);
                setError(error?.response?.data?.message || error?.message || "Failed to fetch applicants.");
            }
        };

        fetchApplicants();
    }, [jobId, token, navigate]);

    return (
        <div className="job-applicants-container">
            <h2>Job Applicants</h2>

            {error && <p className="error-message">{error}</p>}

            {applicants.length === 0 ? (
                <p>No applicants yet.</p>
            ) : (
                <ul className="applicant-list">
                    {applicants.map((applicant) => (
                        <li key={applicant._id} className="applicant-card">
                            <h3>{applicant.jobSeeker?.name || "No Name"}</h3>
                            <p><strong>Email:</strong> {applicant.jobSeeker?.email || "No Email"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobApplicants;
