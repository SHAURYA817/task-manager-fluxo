import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import API from "../api/axios.js";
import toast from "react-hot-toast";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  const [deleteProjectId, setDeleteProjectId] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const currentUserId = useMemo(() => {
    return (
      currentUser?._id ||
      currentUser?.user?._id ||
      currentUser?.id
    );
  }, [currentUser]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get("/projects");

      setProjects(res.data.projects || []);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditProjectId(null);

    setFormData({
      name: "",
      description: "",
    });

    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditProjectId(project._id);

    setFormData({
      name: project.name || "",
      description: project.description || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setEditProjectId(null);

    setFormData({
      name: "",
      description: "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitProject = async (e) => {
    e.preventDefault();

    try {
      if (editProjectId) {
        await API.put(
          `/projects/${editProjectId}`,
          formData
        );

        toast.success(
          "Project updated successfully"
        );
      } else {
        await API.post("/projects", formData);

        toast.success(
          "Project created successfully"
        );
      }

      closeModal();

      fetchProjects();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  const handleDeleteProject = async () => {
    try {
      await API.delete(
        `/projects/${deleteProjectId}`
      );

      setProjects((prev) =>
        prev.filter(
          (project) =>
            project._id !== deleteProjectId
        )
      );

      toast.success(
        "Project deleted successfully"
      );

      setShowDeleteModal(false);

      setDeleteProjectId(null);
    } catch (error) {
      console.log(error);

      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="min-h-screen bg-[#03040d] text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1d4ed8,transparent_35%)] opacity-20" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
          <div>
            <Link
              to="/dashboard"
              className="text-sm text-white/50 hover:text-white transition"
            >
              ← Return Dashboard
            </Link>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mt-5 leading-none tracking-tight">
              Workspace
            </h1>

            <p className="text-white/50 mt-5 max-w-2xl text-sm sm:text-base leading-relaxed">
              A futuristic collaboration hub where teams manage projects,
              monitor performance and build together.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="group relative overflow-hidden w-full sm:w-auto px-7 py-4 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold transition hover:scale-[1.02]"
          >
            <span className="relative z-10">
              + Create Workspace
            </span>

            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition duration-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-12">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Total Workspaces
            </p>

            <h2 className="text-5xl font-black mt-4">
              {projects.length}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Active Teams
            </p>

            <h2 className="text-5xl font-black mt-4">
              {projects.length}
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Completed
            </p>

            <h2 className="text-5xl font-black mt-4">
              0
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-7">
            <p className="text-white/40 text-sm">
              Productivity
            </p>

            <h2 className="text-5xl font-black mt-4">
              92%
            </h2>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-32 text-center text-xl text-white/60">
            Loading futuristic workspaces...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-16 text-center">
            <h2 className="text-4xl font-bold">
              No Workspace Found
            </h2>

            <p className="text-white/50 mt-5 max-w-xl mx-auto">
              Start building your first futuristic collaboration environment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
            {projects.map((project) => {
              const isAdmin =
                project.members?.some(
                  (member) => {
                    const memberUserId =
                      member.user?._id ||
                      member.user;

                    return (
                      String(memberUserId) ===
                        String(
                          currentUserId
                        ) &&
                      String(
                        member.role
                      ).toLowerCase() ===
                        "admin"
                    );
                  }
                );

              return (
                <div
                  key={project._id}
                  className="group relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-6 sm:p-8 hover:border-blue-500/20 transition duration-500"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-blue-500/10 to-violet-500/10" />

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 flex items-center justify-center font-bold text-lg">
                            {project.name?.charAt(0)}
                          </div>

                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold break-words">
                              {project.name}
                            </h2>

                            <p className="text-xs text-cyan-300 mt-1 uppercase tracking-[3px]">
                              Premium Workspace
                            </p>
                          </div>
                        </div>

                        <p className="text-white/50 leading-relaxed text-sm sm:text-base break-words">
                          {project.description ||
                            "No description available for this workspace."}
                        </p>
                      </div>

                      <div className="w-fit px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium whitespace-nowrap">
                        Live
                      </div>
                    </div>

                    {/* Mini Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-white/40 text-xs uppercase tracking-[2px]">
                          Launch Date
                        </p>

                        <h3 className="font-semibold mt-3 text-lg">
                          {project.createdAt
                            ? new Date(
                                project.createdAt
                              ).toLocaleDateString()
                            : "N/A"}
                        </h3>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                        <p className="text-white/40 text-xs uppercase tracking-[2px]">
                          Team Members
                        </p>

                        <h3 className="font-semibold mt-3 text-lg">
                          {project.members?.length || 0}
                        </h3>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-white/40">
                          Workspace Progress
                        </p>

                        <span className="text-sm font-semibold">
                          78%
                        </span>
                      </div>

                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-center px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:scale-[1.02] transition"
                      >
                        Open Workspace
                      </Link>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() =>
                              openEditModal(project)
                            }
                            className="px-5 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              setDeleteProjectId(
                                project._id
                              );

                              setShowDeleteModal(
                                true
                              );
                            }}
                            className="px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-[#0b1120] p-7 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {editProjectId
                    ? "Edit Workspace"
                    : "Create Workspace"}
                </h2>

                <p className="text-white/40 mt-3 text-sm">
                  Build a futuristic environment for your team.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-white/40 hover:text-white transition text-xl"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitProject}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-white/50 mb-3">
                  Workspace Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter workspace name"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-5 py-4 outline-none focus:border-blue-500/40 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-white/50 mb-3">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe your futuristic workspace"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 px-5 py-4 outline-none resize-none focus:border-blue-500/40 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-3xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold hover:scale-[1.01] transition"
              >
                {editProjectId
                  ? "Update Workspace"
                  : "Create Workspace"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-[40px] border border-white/10 bg-[#0b1120] p-7">
            <h2 className="text-3xl font-bold">
              Delete Workspace
            </h2>

            <p className="text-white/50 mt-4 leading-relaxed">
              Are you sure you want to permanently delete this workspace?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="flex-1 py-4 rounded-3xl border border-white/10 hover:bg-white/[0.05] transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProject}
                className="flex-1 py-4 rounded-3xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
