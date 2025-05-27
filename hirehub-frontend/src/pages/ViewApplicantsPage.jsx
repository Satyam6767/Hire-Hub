import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewApplicantsPage = () => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState("");

    const fetchApplicants = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/${jobId}/applicants`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setApplicants(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching applicants:", err);
            setLoading(false);
        }
    };

    const fetchJobTitle = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setJobTitle(data.title || "Unknown Title");
        } catch (err) {
            console.error("Error fetching job title:", err);
            setJobTitle("Unknown Title");
        }
    };

    const updateStatus = async (applicationId, status) => {
        const token = localStorage.getItem("token");
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/applications/status/${applicationId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            fetchApplicants(); // refresh data
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    useEffect(() => {
        fetchApplicants();
        fetchJobTitle();
    }, []);

    return (
        <div className="applicants-container">
            <h2>Applicants for Job: {jobTitle}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : applicants.length === 0 ? (
                <p>No applicants found.</p>
            ) : (
                applicants.map((app) => {
                    const resumeLink = app.jobSeeker?.resume || app.resume;
                    const fullResumeURL = `${import.meta.env.VITE_API_URL}/${resumeLink.replace(/\\/g, "/")}`;
                    console.log("Resume Link:", fullResumeURL);


                    return (
                        <div key={app._id} className="applicant-card">
                            <p><strong>Name:</strong> {app.jobSeeker?.name}</p>
                            <p><strong>Email:</strong> {app.jobSeeker?.email}</p>
                            <p><strong>Status:</strong> {app.status}</p>

                            {resumeLink ? (
                                <a
                                    href={fullResumeURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "inline-block",
                                        margin: "10px 0",
                                        color: "blue",
                                        cursor: "pointer",
                                    }}
                                >
                                    Show Resume
                                </a>
                            ) : (
                                <p>No resume uploaded</p>
                            )}

                            <select
                                value={app.status}
                                onChange={(e) => updateStatus(app._id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ViewApplicantsPage;
