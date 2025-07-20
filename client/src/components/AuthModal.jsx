import React, { useState } from "react";
import "./AuthModal.css";

const AuthModal = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = () => {
    if (loginData.username && loginData.password) {
      const mockUser = { username: loginData.username };
      onLoginSuccess(mockUser);
      onClose();
    } else {
      alert("Please enter username and password");
    }
  };

  const handleSignupSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        onClose();
      } else {
        alert(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>

        <div className="modal-toggle-buttons">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>Log In</button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>

        {isLogin ? (
          <div className="form-container">
            <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange} />
            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
            <div className="form-buttons">
              <button onClick={handleLoginSubmit}>Log In</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="form-container">
            <input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupChange} />
            <input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupChange} />
            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange} />
            <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange} />
            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange} />
            <div className="form-buttons">
              <button onClick={handleSignupSubmit}>Sign Up</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
