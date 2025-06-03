import React, { useState } from "react";
import "./styles/Form.css";

const EmailVerificationForm = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSendOTP = (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("Please enter your email.");
      return;
    }

    // Placeholder for sending OTP
    setStatus("Sending OTP...");
    setTimeout(() => {
      setStatus("OTP sent successfully to your email.");
    }, 1500);
  };

  return (
    <div className="email-verification-container">
      <form className="email-form" onSubmit={handleSendOTP}>
        <h2>Verify Your Email</h2>
        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
        {status && <p className="status-message">{status}</p>}
      </form>
    </div>
  );
};

export default EmailVerificationForm;
