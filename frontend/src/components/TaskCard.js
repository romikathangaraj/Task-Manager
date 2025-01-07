import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const TaskCard = ({ task }) => {
  return (
    <Card sx={{ marginBottom: "10px" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {task.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {task.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Assigned To: {task.assignedTo ? task.assignedTo.name : "Unassigned"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
