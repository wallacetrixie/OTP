import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Signup
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [signupError, setSignupError] = useState(false);

  // Forgot Password with OTP
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpError, setOtpError] = useState(false);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setLoginEmail("");
    setLoginPassword("");
    setSignupUsername("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setLoginMessage("");
    setLoginError(false);
    setSignupMessage("");
    setSignupError(false);
    setShowOTPForm(false);
    setOtpEmail("");
    setOtpInputs(["", "", "", "", "", ""]);
    setOtpMessage("");
    setOtpError(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
    setLoginError(false);
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        {
          email: loginEmail,
          password: loginPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setLoginMessage(res.data.message);
        setLoginError(false);
      } else {
        setLoginError(true);
        setLoginMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      setLoginError(true);
      setLoginMessage("Server error during login.");
      console.error(err);
    }
  };

  const handleOTPInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Move to next field
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!otpEmail || !otpEmail.includes("@")) {
      setOtpError(true);
      setOtpMessage("Enter a valid email address.");
      return;
    }
    setOtpError(false);
    setOtpMessage("OTP sent successfully to your email.");
    // TODO: Implement actual backend request
  };

  const validateSignup = () => {
    const errors = [];
    if (!signupUsername.trim() || signupUsername.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(signupEmail)) {
      errors.push("Invalid email format");
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(signupPassword)) {
      errors.push(
        "Password must be at least 8 characters long, contain an uppercase letter and a number"
      );
    }
    if (signupPassword !== signupConfirmPassword) {
      errors.push("Passwords do not match");
    }
    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupMessage("");
    setSignupError(false);

    const errors = validateSignup();
    if (errors.length > 0) {
      setSignupMessage(errors.join(". "));
      setSignupError(true);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        {
          username: signupUsername,
          email: signupEmail,
          password: signupPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSignupMessage(res.data.message);
        setSignupError(false);
      } else {
        setSignupMessage(res.data.message || "Signup failed");
        setSignupError(true);
      }
    } catch (err) {
      setSignupMessage("Server error during signup.");
      setSignupError(true);
      console.error(err);
    }
  };

  useEffect(() => {
    if (loginMessage) {
      const timer = setTimeout(() => {
        setLoginMessage("");
        setLoginError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [loginMessage]);

  useEffect(() => {
    if (signupMessage) {
      const timer = setTimeout(() => {
        setSignupMessage("");
        setSignupError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [signupMessage]);

  useEffect(() => {
    if (otpMessage) {
      const timer = setTimeout(() => {
        setOtpMessage("");
        setOtpError(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [otpMessage]);

  return (
    <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
      {/* Login Form */}
      <form
        className="form sign-in"
        style={{ display: isSignUp ? "none" : "block" }}
        onSubmit={handleLogin}
      >
        <h2>Welcome</h2>
        <label className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </label>
        <label className="input-group">
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </label>
        {loginMessage && (
          <p className={loginError ? "error-msg" : "success-msg"}>
            {loginMessage}
          </p>
        )}
        <button type="submit" className="submit">
          Sign In
        </button>
        <div
          className="forgot-pass"
          onClick={() => setShowOTPForm(!showOTPForm)}
        >
          Forgot Password?
        </div>

        {showOTPForm && (
          <div className="otp-reset-form">
            <h4>Reset Password</h4>
            <input
              type="email"
              placeholder="Enter your email"
              value={otpEmail}
              onChange={(e) => setOtpEmail(e.target.value)}
            />
            <button onClick={handleSendOTP} className="submit">
              Send OTP
            </button>
            <div className="otp-inputs">
              {otpInputs.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOTPInputChange(i, e.target.value)}
                />
              ))}
            </div>
            {otpMessage && (
              <p className={otpError ? "error-msg" : "success-msg"}>
                {otpMessage}
              </p>
            )}
          </div>
        )}
      </form>

      {/* Switch Panel */}
      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>
          <div className="img__btn" onClick={toggleMode}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        {/* Signup Form */}
        <form
          className="form sign-up"
          style={{ display: isSignUp ? "block" : "none" }}
          onSubmit={handleSignup}
        >
          <h2>Create your Account</h2>
          <label className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              placeholder="Username"
              required
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
          </label>
          <label className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={signupConfirmPassword}
              onChange={(e) => setSignupConfirmPassword(e.target.value)}
            />
          </label>
          {signupMessage && (
            <p className={signupError ? "error-msg" : "success-msg"}>
              {signupMessage}
            </p>
          )}
          <button type="submit" className="submit">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
