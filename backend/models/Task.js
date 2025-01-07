const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  assignedTo:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['assigned', 'done'], default: 'assigned' },
});

module.exports = mongoose.model('Task', taskSchema);
