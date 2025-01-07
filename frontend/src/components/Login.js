import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Alert, 
  Card, 
  CardContent 
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://task-manager-backendservice.onrender.com/api/auth/login", {
        email,
        password,
      });
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "member") navigate("/member-dashboard");
      else setError("Invalid role");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fdf6e3", // Light grayish-blue background
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            padding: "20px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            background: "white",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              style={{ fontFamily: "Roboto", color: "red",textAlign: "center" }}
            >
              Welcome to TaskTrack
            </Typography>
            {error && (
              <Alert severity="error" style={{ marginBottom: "20px", textAlign: "left" }}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              style={{
                backgroundColor: "#3f51b5",
                color: "#fff",
                marginTop: "20px",
                padding: "10px",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
            <Typography
              variant="caption"
              style={{ marginTop: "20px", color: "#666", display: "block", textAlign: "center" }}
            >
              TaskTrack - Simplify Your Work Today!
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
