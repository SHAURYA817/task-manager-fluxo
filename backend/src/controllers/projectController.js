import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body || {};

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "Admin",
        },
      ],
    });

    res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      "members.user": req.user.id,
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findOne({
      _id: id,
      members: {
        $elemMatch: {
          user: req.user.id,
          role: "Admin",
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or not authorized",
      });
    }

    project.name = name || project.name;
    project.description = description ?? project.description;

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOneAndDelete({
      _id: id,
      members: {
        $elemMatch: {
          user: req.user.id,
          role: "Admin",
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or not authorized",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id } = req.params;

    const { email, role } = req.body;

    const project = await Project.findOne({
      _id: id,
      members: {
        $elemMatch: {
          user: req.user.id,
          role: "Admin",
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyMember = project.members.find(
      (member) =>
        member.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a member",
      });
    }

    project.members.push({
      user: user._id,
      role: role || "Member",
    });

    await project.save();

    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findOne({
      _id: id,
      members: {
        $elemMatch: {
          user: req.user.id,
          role: "Admin",
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized",
      });
    }

    const memberToRemove = project.members.find(
      (member) => member.user.toString() === userId
    );

    if (!memberToRemove) {
      return res.status(404).json({
        message: "Member not found in project",
      });
    }

    if (memberToRemove.role === "Admin") {
      return res.status(400).json({
        message: "Admin cannot be removed",
      });
    }

    project.members = project.members.filter(
      (member) => member.user.toString() !== userId
    );

    await project.save();

    await Task.deleteMany({
      project: id,
      assignedTo: userId,
    });

    res.status(200).json({
      message: "Member and related tasks removed successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};