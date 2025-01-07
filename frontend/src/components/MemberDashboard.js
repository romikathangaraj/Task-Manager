import React, { useEffect, useState } from "react";
import { Typography, Grid, CircularProgress, Card, Checkbox, FormControlLabel, Button, Box } from "@mui/material";
import axios from "axios";

const MemberDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("https://task-manager-backendservice.onrender.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleStatusChange = async (task) => {
    const token = localStorage.getItem("token");
    try {
      // Update task status via API
      await axios.put(`https://task-manager-backendservice.onrender.com/${task._id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the task status in the frontend state
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: t.status === 'assigned' ? 'done' : 'assigned' } : t));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };

  if (loading) return <CircularProgress />;

  return (
    <div style={{ padding: "20px", backgroundColor: "#fdf6e3", minHeight: "100vh" }}>
      {/* Title Section */}
      <Box display="flex" justifyContent="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Member Dashboard
        </Typography>
      </Box>

      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Display "assigned" and "done" tasks only */}
        {["assigned", "done"].map((status) => (
          <Grid item xs={12} md={6} key={status}>
            <Card
              style={{
                padding: "15px",
                backgroundColor: status === "assigned" ? "#f0f4f8" : "#d1f7d1", // Different pastel colors for assigned and done
                marginBottom: "20px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Added shadow for a lifted effect
              }}
            >
              <Typography variant="h6" align="center" style={{ fontWeight: "bold" }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Typography>

              {tasks
                .filter((task) => task.status === status) // Filter tasks by "assigned" or "done"
                .map((task) => (
                  <Box key={task._id} mb={2}>
                    <Card style={{ padding: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
                      <Typography variant="h6">{task.title}</Typography>
                      <Typography variant="body2">{task.description}</Typography>
                      {/* Checkbox to update task status */}
                      <FormControlLabel
                        control={<Checkbox checked={task.status === "done"} />}
                        label={task.status === "done" ? "Mark as Assigned" : "Mark as Done"}
                        onChange={() => handleStatusChange(task)} // Handle status change on checkbox click
                      />
                    </Card>
                  </Box>
                ))}
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MemberDashboard;
