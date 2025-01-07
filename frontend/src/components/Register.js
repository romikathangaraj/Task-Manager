import React, { useState } from "react";
import { TextField, Button, Typography, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "member", // Default role is "member"
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", user);
      alert("User registered successfully!");
      navigate("/admin-dashboard"); // Navigate to Admin Dashboard after success
    } catch (error) {
      console.error("Error registering user:", error.message);
      alert("Failed to register user. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Register New User
      </Typography>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <TextField
        label="Role"
        select
        fullWidth
        margin="normal"
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
        helperText="Please select the user role"
      >
        <MenuItem value="member">Member</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        style={{ marginTop: "20px" }}
        fullWidth
      >
        Register
      </Button>
    </div>
  );
};

export default Register;
