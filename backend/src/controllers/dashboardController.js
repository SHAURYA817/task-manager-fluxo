import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const getDashboardStats = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    });

    const projectIds = projects.map((project) => project._id);

    const adminProjectIds = projects
      .filter((project) =>
        project.members.some(
          (member) =>
            member.user.toString() === req.user.id &&
            member.role === "Admin"
        )
      )
      .map((project) => project._id);

    const tasks = await Task.find({
      $or: [
        {
          project: {
            $in: adminProjectIds,
          },
        },
        {
          assignedTo: req.user.id,
          project: {
            $in: projectIds,
          },
        },
      ],
    });

    const totalTasks = tasks.length;

    const todoTasks = tasks.filter(
      (task) => task.status === "To Do"
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "Done"
    ).length;

    const overdueTasks = tasks.filter(
      (task) =>
        new Date(task.dueDate) < new Date() &&
        task.status !== "Done"
    ).length;

    res.status(200).json({
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};