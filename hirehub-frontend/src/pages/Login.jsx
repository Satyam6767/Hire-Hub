import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; 
import Navbar from "../components/Navbar";
import '../index.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);

            // ✅ SweetAlert success popup
            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome back!",
                confirmButtonColor: "#3085d6",
            }).then(() => {
                navigate("/dashboard");
            });

        } catch (error) {
            console.error("Login failed", error.response?.data);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-backg">
                <form className="bg-primary" onSubmit={handleLogin}>
                    <h1 style={{ color: "white", marginBottom: "15px" }}>LOGIN</h1>

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
                                top: "20%", 
                                transform: "translateY(-50%)", 
                                cursor: "pointer",
                                color: "gray"
                            }}
                        >
                            {showPassword ? "🔒" : "👁️"}
                        </span>
                    </div>

                    <button type="submit">Login</button>
                    <p>Don't have an account</p>
                    <Link style={{ color: "white" }} to="/register">Register here</Link>
                </form>
            </div>
        </>
    );
};

export default Login;

