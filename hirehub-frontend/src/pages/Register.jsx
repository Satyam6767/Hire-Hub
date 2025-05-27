import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import Navbar from "../components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job_seeker");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    // Must contain at least one uppercase letter, one special character, and be at least 6 characters
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password before sending request
    if (!validatePassword(password)) {
      setError(
        "Password must have at least one uppercase letter, one special character, and be at least 6 characters long."
      );
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);

      Swal.fire({
        icon: "success",
        title: "Registered Successfully",
        text: "You can now login!",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      console.error("Registration failed", error.response?.data);
    }
  };

  return (
    <div>
      <Navbar />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="bg-backg">
        <form className="bg-primary" onSubmit={handleRegister}>
          <h1 style={{ color: "white", marginBottom: "15px" }}>REGISTER</h1>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "25%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "gray",
              }}
            >
              {showPassword ? "🔒" : "👁️"}
            </span>
          </div>

          

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="job_seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
