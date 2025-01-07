import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignedToEmails: [] });
  const navigate = useNavigate(); // Hook for navigation

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // Redirect to login if no token
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/tasks/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
      }
    };
    fetchTasks();
  }, [navigate]);

  // Add a new task
  const handleAddTask = async () => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/tasks",
      { ...newTask, assignedToEmails: newTask.assignedToEmails.split(",") }, // Split input string by commas
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOpen(false);
    window.location.reload();
  };

  // Open edit dialog
  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditOpen(true);
  };

  // Save updated task
  const handleSaveTask = async () => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/tasks/${currentTask._id}`,
      { ...currentTask, assignedToEmails: currentTask.assignedToEmails.split(",") }, // Split input string by commas
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditOpen(false);
    window.location.reload();
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    navigate("/"); // Redirect to login page
  };

  return (
    <div style={{ backgroundColor: "#f9f3e8", minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)} style={{ marginRight: "10px" }}>
        Add Task
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/register")} // Navigate to registration page
        style={{ marginRight: "10px" }}
      >
        Register
      </Button>
      <Button variant="contained" color="error" onClick={handleLogout} style={{ marginRight: "10px" }}>
        Logout
      </Button>
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {tasks.map((task) => (
          <Grid item xs={12} md={4} key={task._id}>
            <Card
              style={{
                backgroundColor: "#ffe4e1",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography>{task.description}</Typography>
                <Typography>
                  Assigned To: {task.assignedTo.length ? task.assignedTo.map((user) => user.name).join(", ") : "Unassigned"}
                </Typography>
                <Typography>Status: {task.status}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditTask(task)}
                  style={{ marginRight: "10px" }}
                >
                  Update
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteTask(task._id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <TextField
            label="Assign To (User Emails, comma separated)"
            fullWidth
            margin="normal"
            value={newTask.assignedToEmails}
            onChange={(e) => setNewTask({ ...newTask, assignedToEmails: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={currentTask?.title || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={currentTask?.description || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
          />
          <TextField
            label="Assign To (User Emails, comma separated)"
            fullWidth
            margin="normal"
            value={currentTask?.assignedToEmails || ""}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, assignedToEmails: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveTask}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
