import Task from "../models/Task.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      projectId,
      assignedTo,
    } = req.body;

    if (!title || !projectId || !dueDate) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const project = await Project.findOne({
      _id: projectId,
      members: {
        $elemMatch: {
          user: req.user.id,
          role: "Admin",
        },
      },
    });

    if (!project) {
      return res.status(403).json({
        message: "Only project admin can create task",
      });
    }

    const taskAssignedTo = assignedTo || req.user.id;
    if (!mongoose.Types.ObjectId.isValid(taskAssignedTo)) {
      return res.status(400).json({
        message: "Invalid assigned user id",
      });
    }

    const isAssignedUserMember = project.members.some(
      (member) => member.user.toString() === taskAssignedTo,
    );

    if (!isAssignedUserMember) {
      return res.status(400).json({
        message: "Assigned user must be a project member",
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "To Do",
      priority: priority || "Medium",
      dueDate,
      project: projectId,
      assignedTo: taskAssignedTo,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    });

    const projectIds = projects.map((project) => project._id);

    const adminProjectIds = projects
      .filter((project) =>
        project.members.some(
          (member) =>
            member.user.toString() === req.user.id && member.role === "Admin",
        ),
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
    })
      .populate("assignedTo", "name email")
      .populate("project", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["To Do", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findOne({
      _id: task.project,
      "members.user": req.user.id,
    });

    if (!project) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    const isAdmin = project.members.some(
      (member) =>
        member.user.toString() === req.user.id && member.role === "Admin",
    );

    const isAssignedUser = task.assignedTo.toString() === req.user.id;

    if (!isAdmin && !isAssignedUser) {
      return res.status(403).json({
        message: "You can update only your assigned task",
      });
    }

    task.status = status;

    await task.save();

    res.status(200).json({
      message: "Task updated",
      task,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
