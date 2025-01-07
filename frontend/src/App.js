import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import MemberDashboard from "./components/MemberDashboard";
import Register from "./components/Register"; // Assuming this file exists


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/member-dashboard" element={<MemberDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
