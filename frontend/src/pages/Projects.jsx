import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios.js";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects || []);
    } catch (error) {
      console.log(error);
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
        await API.put(`/projects/${editProjectId}`, formData);
      } else {
        await API.post("/projects", formData);
      }

      closeModal();

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${projectId}`);

      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="relative min-h-screen bg-black text-white overflow-hidden">
    {/* Background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

    {/* Glow */}
    <div className="absolute top-10 left-10 w-96 h-96 bg-violet-500/20 blur-[120px] rounded-full" />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
        <div>
          <Link
            to="/dashboard"
            className="text-sm text-white/40 hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight mt-4">
            Projects
          </h1>

          <p className="text-white/50 mt-4 text-lg max-w-3xl leading-relaxed">
            Manage projects, collaborate with your team and track workspace progress.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.02] transition"
        >
          Create Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">
            Total Projects
          </p>

          <h2 className="text-5xl font-semibold mt-4">
            {projects.length}
          </h2>
        </div>

        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">
            Active Projects
          </p>

          <h2 className="text-5xl font-semibold mt-4">
            {projects.length}
          </h2>
        </div>

        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-6">
          <p className="text-white/40 text-sm">
            Completed
          </p>

          <h2 className="text-5xl font-semibold mt-4">
            0
          </h2>
        </div>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-14 text-center">
          <h2 className="text-3xl font-semibold">
            No projects found
          </h2>

          <p className="text-white/50 mt-4 text-lg">
            Create your first project to start collaborating.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-7 hover:bg-white/[0.05] transition"
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    {project.name}
                  </h2>

                  <p className="text-white/50 mt-4 leading-relaxed">
                    {project.description ||
                      "No description added"}
                  </p>
                </div>

                <span className="px-4 py-2 rounded-full text-xs bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 text-indigo-300 whitespace-nowrap">
                  Active
                </span>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-5">
                  <p className="text-white/40 text-sm">
                    Created At
                  </p>

                  <h3 className="font-medium mt-3">
                    {project.createdAt
                      ? new Date(
                          project.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </h3>
                </div>

                <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-5">
                  <p className="text-white/40 text-sm">
                    Members
                  </p>

                  <h3 className="font-medium mt-3">
                    {project.members?.length || 0} Members
                  </h3>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-white/40">
                    Project Progress
                  </p>

                  <span className="text-sm">
                    68%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to={`/projects/${project._id}`}
                  className="text-center px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.02] transition"
                >
                  Open
                </Link>

                <button
                  onClick={() => openEditModal(project)}
                  className="px-5 py-4 rounded-2xl border border-white/10 hover:bg-white/[0.05] transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                  className="px-5 py-4 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-xl border border-white/10 bg-[#0f172a] rounded-[32px] p-7">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-semibold">
                {editProjectId
                  ? "Edit Project"
                  : "Create Project"}
              </h2>

              <p className="text-white/40 mt-2">
                Manage your workspace projects.
              </p>
            </div>

            <button
              onClick={closeModal}
              className="text-white/40 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmitProject}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-3 text-white/50">
                Project Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none focus:border-indigo-500/40 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-3 text-white/50">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Enter project description"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none resize-none focus:border-indigo-500/40 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.01] transition"
            >
              {editProjectId
                ? "Update Project"
                : "Create Project"}
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default Projects;