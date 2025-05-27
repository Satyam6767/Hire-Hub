import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/JobList.css";
import Swal from "sweetalert2";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    number: "",
    resume: null
  });

  const [result, setResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/jobs/all`);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs", error.response?.data);
      }
    };
    fetchJobs();
  }, []);

  const openForm = (jobId) => {
    setSelectedJobId(jobId);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormData({ name: "", experience: "", number: "", resume: null });
    setResult("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You need to log in to apply for jobs.",
      });
      navigate("/login");
      return;
    }

    try {
      // Prepare data for backend (with resume)
      const backendData = new FormData();
      backendData.append("name", formData.name);
      backendData.append("experience", formData.experience);
      backendData.append("number", formData.number);
      backendData.append("resume", formData.resume);

      // Send to backend API
      const backendResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/jobs/apply/${selectedJobId}`,
        backendData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Prepare data for Web3Forms (exclude resume)
      const web3Data = new FormData();
      web3Data.append("name", formData.name);
      web3Data.append("experience", formData.experience);
      web3Data.append("number", formData.number);
      web3Data.append("access_key", "");

      // Send to Web3Forms
      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3Data,
      });

      const web3Result = await web3Response.json();

      if (!web3Result.success) {
        console.error("Web3Forms error:", web3Result.message);
        // Optionally show user a warning here or just log it
      }

      Swal.fire({
        icon: "success",
        title: "Application Submitted",
        text: backendResponse.data.message,
      });

      closeForm();
    } catch (error) {
      console.error("Error applying for job", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: error.response?.data?.message || "Application failed",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="job-list-container">
        <div className="job-list-content">
          <h2>Available Jobs</h2>
          {jobs.length === 0 ? (
            <p className="no-jobs">No jobs available.</p>
          ) : (
            <ul className="job-list">
              {jobs.map((job) => (
                <li key={job._id} className="job-item">
                  <h3>{job.title} - <span className="job-company">{job.company}</span></h3>
                  <p className="job-description">{job.description}</p>
                  <p className="job-detail"><strong>Location:</strong> {job.location}</p>
                  <p className="job-detail"><strong>Salary:</strong> {job.salary || "Not disclosed"}</p>
                  <button className="apply-button" onClick={() => openForm(job._id)}>Apply</button>
                </li>
              ))}
            </ul>
          )}

          {/* MODAL POPUP FORM */}
          {showForm && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
              backgroundColor: "rgba(0,0,0,0.6)", display: "flex",
              justifyContent: "center", alignItems: "center", zIndex: 1000
            }}>
              <form
                onSubmit={handleFormSubmit}
                style={{
                  background: "#fff", padding: "30px", borderRadius: "10px",
                  width: "90%", maxWidth: "400px", position: "relative", boxShadow: "0 0 15px rgba(0,0,0,0.2)"
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "#ff4d4d", color: "#fff", border: "none",
                    borderRadius: "50%", width: "30px", height: "30px",
                    cursor: "pointer", fontWeight: "bold"
                  }}
                >
                  ×
                </button>
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Apply for Job</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                  type="text"
                  name="experience"
                  placeholder="Your Experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Your Contact Number"
                  value={formData.number}
                  onChange={handleInputChange}
                  required
                  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                  required
                  style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
                />
                <button type="submit" style={{
                  width: "100%", padding: "10px", backgroundColor: "#4caf50",
                  color: "white", border: "none", borderRadius: "5px",
                  cursor: "pointer"
                }}>
                  Submit Application
                </button>
                <p style={{ marginTop: "10px", color: "green", textAlign: "center" }}>{result}</p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobList;
