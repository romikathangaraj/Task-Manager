const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create a task
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, assignedToEmails } = req.body;

    if (!Array.isArray(assignedToEmails) || assignedToEmails.length === 0) {
      return res.status(400).send("assignedToEmails must be a non-empty array");
    }

    // Find users by their emails
    const users = await User.find({ email: { $in: assignedToEmails } });

    if (users.length !== assignedToEmails.length) {
      return res
        .status(404)
        .send("Some users with the provided emails were not found");
    }

    const userIds = users.map((user) => user._id);

    const task = new Task({
      title,
      description,
      assignedTo: userIds,
      status: "assigned", // Default status
      createdBy: req.user.id, // Current user's ID
    });

    await task.save();
    res.status(201).send("Task created successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all tasks for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = req.user.role === 'admin'
      ? await Task.find().populate('assignedTo', 'name email')
      : await Task.find({ assignedTo: req.user.id }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get tasks created by the logged-in admin user
router.get("/admin", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update task details
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, description, assignedToEmails } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).send('Task not found');

    // Ensure only the task creator or admin can update the task
    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).send('Access denied');
    }

    // Update fields if provided
    task.title = title || task.title;
    task.description = description || task.description;

    // If assignedToEmails is provided, update the assigned users
    if (assignedToEmails) {
      if (!Array.isArray(assignedToEmails) || assignedToEmails.length === 0) {
        return res.status(400).send("assignedToEmails must be a non-empty array");
      }

      const users = await User.find({ email: { $in: assignedToEmails } });

      if (users.length !== assignedToEmails.length) {
        return res
          .status(404)
          .send("Some users with the provided emails were not found");
      }

      task.assignedTo = users.map((user) => user._id);
    }

    await task.save();
    res.send('Task updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});
// Delete a task
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).send("Task not found");

    // Only allow deletion if the user is the task creator or an admin
    if (task.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).send("Access denied");
    }

    await Task.findByIdAndDelete(req.params.id);
    res.send("Task deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update task status (assigned to done and vice versa)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send("Task not found");
    }

    // Only update the status for tasks assigned to the logged-in user
    if (!task.assignedTo.includes(req.user.id)) {
      return res.status(403).send("You cannot update the status of this task");
    }

    // Toggle between assigned and done
    task.status = task.status === 'assigned' ? 'done' : 'assigned';
    await task.save();
    res.send("Task status updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;