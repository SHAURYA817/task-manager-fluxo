import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [memberEmail, setMemberEmail] =
    useState("");

  const [showTaskModal, setShowTaskModal] =
    useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    status: "To Do",
  });

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const currentUserId =
    currentUser?._id ||
    currentUser?.user?._id ||
    currentUser?.id;

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await API.get(`/projects/${id}`);

      setProject(res.data);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load workspace");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      const filteredTasks = (
        res.data.tasks || []
      ).filter(
        (task) => task.project?._id === id
      );

      setTasks(filteredTasks);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load tasks");
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail) {
      toast.error("Enter member email");

      return;
    }

    try {
      await API.post(
        `/projects/${id}/add-member`,
        {
          email: memberEmail,
          role: "Member",
        }
      );

      toast.success("Member added");

      setMemberEmail("");

      fetchProject();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add member"
      );
    }
  };

  const handleAddTask = async () => {
    if (
      !taskForm.title ||
      !taskForm.assignedTo
    ) {
      toast.error(
        "Please complete all required fields"
      );

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

      toast.success("Task created");

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
      toast.error(
        error.response?.data?.message ||
          "Task creation failed"
      );
    }
  };

  const handleRemoveMember = async (
    userId
  ) => {
    try {
      await API.delete(
        `/projects/${id}/remove-member/${userId}`
      );

      setProject((prev) => ({
        ...prev,
        members: prev.members.filter(
          (member) =>
            member.user._id !== userId
        ),
      }));

      toast.success("Member removed");
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[#01030a] text-white flex items-center justify-center">
        Loading workspace...
      </div>
    );
  }

  const isAdmin = project?.members?.some(
    (member) => {
      const memberUserId =
        member.user?._id || member.user;

      return (
        String(memberUserId) ===
          String(currentUserId) &&
        String(
          member.role
        ).toLowerCase() === "admin"
      );
    }
  );

  return (
    <div className="min-h-screen bg-[#01040c] text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb22,transparent_35%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[70px_70px]" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10">
          <div>
            <Link
              to="/projects"
              className="text-sm text-white/40 hover:text-white transition"
            >
              ← Return to Workspace
            </Link>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mt-5 leading-none tracking-tight">
              {project.name}
            </h1>

            <p className="text-white/50 mt-5 max-w-3xl leading-relaxed">
              {project.description ||
                "No workspace description available."}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                Live Workspace
              </div>

              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                Team Active
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() =>
                setShowTaskModal(true)
              }
              className="w-full sm:w-auto px-7 py-4 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:scale-[1.02] transition"
            >
              + Create Mission
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Team Members
            </p>

            <h2 className="text-5xl font-black mt-4">
              {project.members?.length || 0}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Total Missions
            </p>

            <h2 className="text-5xl font-black mt-4">
              {tasks.length}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Workspace Status
            </p>

            <h2 className="text-3xl font-black mt-5">
              Active
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Created By
            </p>

            <h2 className="text-2xl font-bold mt-5 break-words">
              {project.createdBy?.name ||
                "Unknown"}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.75fr] gap-7">
          {/* Tasks */}
          <div className="rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">
                  Missions
                </h2>

                <p className="text-white/40 mt-2">
                  Track and manage workspace
                  tasks.
                </p>
              </div>

              <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                {tasks.length} Tasks
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
                <p className="text-white/50">
                  No missions created yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="group rounded-[30px] border border-white/10 bg-black/20 p-6 hover:border-blue-500/20 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                      <div className="min-w-0">
                        <h3 className="text-2xl font-bold break-words">
                          {task.title}
                        </h3>

                        <p className="text-white/50 mt-3 leading-relaxed">
                          {task.description ||
                            "No description"}
                        </p>
                      </div>

                      <div className="px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm whitespace-nowrap">
                        {task.priority}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
                      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                        <p className="text-white/40 text-xs uppercase tracking-[2px]">
                          Status
                        </p>

                        <h4 className="font-semibold mt-2">
                          {task.status}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                        <p className="text-white/40 text-xs uppercase tracking-[2px]">
                          Assigned
                        </p>

                        <h4 className="font-semibold mt-2 break-words">
                          {task.assignedTo?.name ||
                            "N/A"}
                        </h4>
                      </div>

                      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                        <p className="text-white/40 text-xs uppercase tracking-[2px]">
                          Priority
                        </p>

                        <h4 className="font-semibold mt-2">
                          {task.priority}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Member */}
            {isAdmin && (
              <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
                <h2 className="text-2xl font-bold">
                  Invite Member
                </h2>

                <p className="text-white/40 mt-2">
                  Add new collaborators to the
                  workspace.
                </p>

                <div className="space-y-4 mt-6">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={memberEmail}
                    onChange={(e) =>
                      setMemberEmail(
                        e.target.value
                      )
                    }
                    className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none focus:border-blue-500/30 transition"
                  />

                  <button
                    onClick={handleAddMember}
                    className="w-full py-4 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:scale-[1.01] transition"
                  >
                    Add Member
                  </button>
                </div>
              </div>
            )}

            {/* Members */}
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6">
              <h2 className="text-2xl font-bold mb-6">
                Team Members
              </h2>

              <div className="space-y-4">
                {project.members?.map(
                  (member) => (
                    <div
                      key={member._id}
                      className="rounded-3xl border border-white/10 bg-black/20 p-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg break-words">
                            {member.user?.name}
                          </h3>

                          <p className="text-white/50 text-sm mt-1 break-words">
                            {
                              member.user?.email
                            }
                          </p>
                        </div>

                        <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap">
                          {member.role}
                        </span>
                      </div>

                      {isAdmin &&
                        member.role !==
                          "Admin" && (
                          <button
                            onClick={() => {
                              toast(
                                (t) => (
                                  <div className="flex flex-col gap-4">
                                    <p className="text-sm">
                                      Remove this
                                      member from
                                      workspace?
                                    </p>

                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          handleRemoveMember(
                                            member
                                              .user
                                              ._id
                                          );

                                          toast.dismiss(
                                            t.id
                                          );
                                        }}
                                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm"
                                      >
                                        Remove
                                      </button>

                                      <button
                                        onClick={() =>
                                          toast.dismiss(
                                            t.id
                                          )
                                        }
                                        className="px-4 py-2 rounded-xl border border-white/10 text-sm"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )
                              );
                            }}
                            className="mt-5 px-4 py-2 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
                          >
                            Remove Member
                          </button>
                        )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-[#0b1120] p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-4xl font-bold">
                  Create Mission
                </h2>

                <p className="text-white/40 mt-3">
                  Assign a futuristic mission
                  to your team.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowTaskModal(false)
                }
                className="text-white/40 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <input
                type="text"
                placeholder="Mission title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              />

              <textarea
                rows="5"
                placeholder="Mission description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    description:
                      e.target.value,
                  })
                }
                className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none resize-none"
              />

              <select
                value={taskForm.assignedTo}
                onChange={(e) =>
                  setTaskForm({
                    ...taskForm,
                    assignedTo:
                      e.target.value,
                  })
                }
                className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
              >
                <option value="">
                  Assign Team Member
                </option>

                {project.members?.map(
                  (member) => (
                    <option
                      key={
                        member.user?._id
                      }
                      value={
                        member.user?._id
                      }
                    >
                      {member.user?.name}
                    </option>
                  )
                )}
              </select>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  value={taskForm.priority}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      priority:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
                >
                  <option>
                    Low
                  </option>
                  <option>
                    Medium
                  </option>
                  <option>
                    High
                  </option>
                </select>

                <select
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      status:
                        e.target.value,
                    })
                  }
                  className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
                >
                  <option>
                    To Do
                  </option>
                  <option>
                    In Progress
                  </option>
                  <option>
                    Done
                  </option>
                </select>
              </div>

              <button
                onClick={handleAddTask}
                className="w-full py-4 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:scale-[1.01] transition"
              >
                Launch Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;