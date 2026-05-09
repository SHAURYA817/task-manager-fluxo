import express from "express";

import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);

router.get("/", authMiddleware, getProjects);

router.get("/:id", authMiddleware, getSingleProject);

router.put("/:id", authMiddleware, updateProject);

router.delete("/:id", authMiddleware, deleteProject);

router.post(
  "/:id/add-member",
  authMiddleware,
  addMember
);

router.delete(
  "/:id/remove-member/:userId",
  authMiddleware,
  removeMember
);

export default router;
