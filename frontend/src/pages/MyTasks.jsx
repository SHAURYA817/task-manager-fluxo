import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}/status`, {
        status,
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "Done"
  ).length;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Glow */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-violet-500/20 blur-[120px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <Link
              to="/dashboard"
              className="text-sm text-white/40 hover:text-white transition"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mt-4 break-words">
              My Tasks
            </h1>

            <p className="text-white/50 mt-4 text-base sm:text-lg max-w-2xl">
              Track progress, update statuses and manage assigned tasks from one workspace.
            </p>
          </div>

          <Link
            to="/projects"
            className="w-full sm:w-auto text-center px-5 sm:px-7 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.02] transition"
          >
            View Projects
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 hover:bg-white/[0.05] transition">
            <p className="text-white/40 text-sm">
              Total Tasks
            </p>

            <h2 className="text-4xl sm:text-5xl font-semibold mt-4 break-words">
              {tasks.length}
            </h2>
          </div>

          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 hover:bg-white/[0.05] transition">
            <p className="text-white/40 text-sm">
              Completed
            </p>

            <h2 className="text-4xl sm:text-5xl font-semibold mt-4 break-words">
              {completedTasks}
            </h2>
          </div>

          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 hover:bg-white/[0.05] transition">
            <p className="text-white/40 text-sm">
              Pending
            </p>

            <h2 className="text-4xl sm:text-5xl font-semibold mt-4 break-words">
              {pendingTasks}
            </h2>
          </div>
        </div>

        {/* Empty State */}
        {tasks.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-8 sm:p-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              No tasks assigned yet
            </h2>

            <p className="text-white/50 mt-4 text-base sm:text-lg">
              Create and assign tasks from your project workspace.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-5 sm:p-7 hover:bg-white/[0.05] transition"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="px-4 py-2 rounded-full text-xs bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 text-indigo-300">
                        {task.priority}
                      </span>

                      <span className="px-4 py-2 rounded-full text-xs border border-white/10 bg-white/[0.03]">
                        {task.status}
                      </span>

                      <span className="px-4 py-2 rounded-full text-xs border border-white/10 bg-white/[0.03] break-words">
                        {task.project?.name || "No Project"}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight break-words">
                      {task.title}
                    </h2>

                    <p className="text-white/50 mt-4 leading-relaxed max-w-3xl break-words text-sm sm:text-base">
                      {task.description || "No description"}
                    </p>

                    <p className="text-white/40 text-sm mt-6 break-words">
                      Due Date:{" "}
                      {task.dueDate
                        ? new Date(
                            task.dueDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[220px]">
                    <button
                      onClick={() =>
                        updateTaskStatus(task._id, "To Do")
                      }
                      className="w-full px-5 py-3 sm:py-4 rounded-2xl border border-white/10 hover:bg-white/[0.05] transition"
                    >
                      To Do
                    </button>

                    <button
                      onClick={() =>
                        updateTaskStatus(
                          task._id,
                          "In Progress"
                        )
                      }
                      className="w-full px-5 py-3 sm:py-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition"
                    >
                      In Progress
                    </button>

                    <button
                      onClick={() =>
                        updateTaskStatus(task._id, "Done")
                      }
                      className="w-full px-5 py-3 sm:py-4 rounded-2xl border border-green-500/20 bg-green-500/10 text-green-300 hover:bg-green-500/20 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTasks;