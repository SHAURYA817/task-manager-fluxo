/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios.js";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberEmail, setMemberEmail] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "To Do",
  });

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      setProject(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      const filteredTasks = (res.data.tasks || []).filter(
        (task) => task.project?._id === id
      );
      setTasks(filteredTasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddMember = async () => {
    if (!memberEmail) return;

    try {
      await API.post(`/projects/${id}/add-member`, {
        email: memberEmail,
        role: "Member",
      });

      setMemberEmail("");
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || "Add member failed");
    }
  };

  const handleAddTask = async () => {
    if (!taskForm.title || !taskForm.assignedTo) {
      alert("Please enter title and assign member");
      return;
    }

    try {
      await API.post("/tasks", {
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: taskForm.assignedTo,
        priority: taskForm.priority,
        status: taskForm.status,
        projectId: id,
        dueDate: new Date(),
      });

      setShowTaskModal(false);

      setTaskForm({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        status: "To Do",
      });

      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Task add failed");
    }
  };

  const handleRemoveMember = async (userId) => {
    const confirmRemove = window.confirm("Remove this member?");
    if (!confirmRemove) return;

    try {
      await API.delete(`/projects/${id}/remove-member/${userId}`);

      setProject((prev) => ({
        ...prev,
        members: prev.members.filter((member) => member.user._id !== userId),
      }));

      setTasks((prev) =>
        prev.filter((task) => task.assignedTo?._id !== userId)
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading project...
      </div>
    );
  }

  return (
  <div className="relative min-h-screen bg-black text-white overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

    {/* Glow */}
    <div className="absolute top-10 right-10 w-96 h-96 bg-violet-500/20 blur-[120px] rounded-full" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
        <div>
          <Link
            to="/projects"
            className="text-sm text-white/40 hover:text-white transition"
          >
            ← Back to Projects
          </Link>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mt-4">
            {project.name}
          </h1>

          <p className="text-white/50 mt-4 text-lg max-w-3xl leading-relaxed">
            {project.description || "No description added"}
          </p>

          <p className="text-white/30 text-sm mt-4">
            Created on{" "}
            {project.createdAt
              ? new Date(project.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.02] transition"
        >
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">Total Members</p>

          <h2 className="text-5xl font-semibold mt-4">
            {project.members?.length || 0}
          </h2>
        </div>

        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">Created By</p>

          <h2 className="text-2xl font-semibold mt-4">
            {project.createdBy?.name || "N/A"}
          </h2>
        </div>

        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">Status</p>

          <h2 className="text-5xl font-semibold mt-4">
            Active
          </h2>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.8fr] gap-6">
        {/* Tasks */}
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-3xl font-semibold">
              Project Tasks
            </h2>

            <p className="text-white/40 mt-2">
              Manage and track all project tasks.
            </p>
          </div>

          <div className="p-6">
            {tasks.length === 0 ? (
              <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-10 text-center">
                <h2 className="text-2xl font-semibold">
                  No tasks yet
                </h2>

                <p className="text-white/50 mt-3">
                  Create your first task to start collaborating.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="border border-white/10 bg-white/[0.03] rounded-3xl p-6 hover:bg-white/[0.05] transition"
                  >
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="px-4 py-2 rounded-full text-xs bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 text-indigo-300">
                        {task.priority || "Medium"}
                      </span>

                      <span className="px-4 py-2 rounded-full text-xs border border-white/10 bg-white/[0.03]">
                        {task.status || "To Do"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-semibold">
                      {task.title}
                    </h3>

                    <p className="text-white/50 mt-3 leading-relaxed">
                      {task.description || "No description"}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-5 text-sm text-white/40">
                      <span>
                        Assigned To:{" "}
                        {task.assignedTo?.name || "N/A"}
                      </span>

                      <span>
                        Due:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="space-y-6">
          {/* Add Member */}
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-6">
            <h2 className="text-2xl font-semibold mb-5">
              Add Member
            </h2>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter member email"
                value={memberEmail}
                onChange={(e) =>
                  setMemberEmail(e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none focus:border-indigo-500/40 transition"
              />

              <button
                onClick={handleAddMember}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.01] transition"
              >
                Add Member
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Project Members
            </h2>

            <div className="space-y-4">
              {project.members?.length === 0 ? (
                <p className="text-white/50">
                  No members found
                </p>
              ) : (
                project.members.map((member) => (
                  <div
                    key={member._id}
                    className="border border-white/10 bg-white/[0.03] rounded-3xl p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {member.user?.name || "Unknown User"}
                      </h3>

                      <p className="text-white/40 text-sm mt-1">
                        {member.user?.email || "No email"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 rounded-full text-xs border border-white/10 bg-white/[0.03]">
                        {member.role}
                      </span>

                      {member.role !== "Admin" && (
                        <button
                          onClick={() =>
                            handleRemoveMember(
                              member.user._id
                            )
                          }
                          className="px-4 py-2 rounded-full text-xs border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Modal */}
    {showTaskModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-xl border border-white/10 bg-[#0f172a] rounded-[32px] p-7">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold">
                Create Task
              </h2>

              <p className="text-white/40 mt-2">
                Add a new task to this project.
              </p>
            </div>

            <button
              onClick={() => setShowTaskModal(false)}
              className="text-white/40 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <div className="space-y-5">
            <input
              type="text"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  title: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none"
            />

            <textarea
              placeholder="Task description"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  description: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none resize-none"
              rows="4"
            />

            <select
              value={taskForm.assignedTo}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  assignedTo: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none"
            >
              <option value="">Assign Member</option>

              {project.members?.map((member) => (
                <option
                  key={member.user?._id}
                  value={member.user?._id}
                >
                  {member.user?.name}
                </option>
              ))}
            </select>

            <select
              value={taskForm.priority}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  priority: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              value={taskForm.status}
              onChange={(e) =>
                setTaskForm({
                  ...taskForm,
                  status: e.target.value,
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none"
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <button
              onClick={handleAddTask}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.01] transition"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default ProjectDetails;