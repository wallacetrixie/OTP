import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login.jsx";
import EmailVerificationForm from "./Form.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/EmailVerification" element={<EmailVerificationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
