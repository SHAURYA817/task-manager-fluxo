import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "User",
  };

  const [stats, setStats] = useState([
    { title: "Total Tasks", value: 0 },
    { title: "In Progress", value: 0 },
    { title: "Completed", value: 0 },
    { title: "Overdue", value: 0 },
  ]);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await API.get("/dashboard/stats");

        const tasksRes = await API.get("/tasks");

        const dashboardStats = statsRes.data;

        const allTasks = tasksRes.data.tasks || [];

        setStats([
          {
            title: "Total Tasks",
            value: dashboardStats.totalTasks || 0,
          },
          {
            title: "In Progress",
            value: dashboardStats.inProgressTasks || 0,
          },
          {
            title: "Completed",
            value: dashboardStats.completedTasks || 0,
          },
          {
            title: "Overdue",
            value: dashboardStats.overdueTasks || 0,
          },
        ]);

        setTasks(allTasks.slice(0, 4));
      } catch (err) {
        console.log("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Glow */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-violet-500/20 blur-[120px] rounded-full" />

      <div className="relative flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col justify-between w-72 shrink-0 min-h-screen border-r border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6">
          <div>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
                F
              </div>

              <div>
                <h1 className="text-2xl font-semibold">
                  Fluxo
                </h1>

                <p className="text-xs text-white/40">
                  Team Workspace
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <div className="space-y-3">
              {["Dashboard", "Projects", "My Tasks"].map(
                (item) => (
                  <Link
                    key={item}
                    to={
                      item === "Projects"
                        ? "/projects"
                        : item === "My Tasks"
                        ? "/my-tasks"
                        : "/dashboard"
                    }
                    className={`block px-5 py-4 rounded-2xl transition ${
                      item === "Dashboard"
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Bottom Card */}
          <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-6">
            <p className="text-white/40 text-sm">
              Workspace Progress
            </p>

            <h2 className="text-4xl font-semibold mt-3">
              86%
            </h2>

            <div className="mt-5 h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[86%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="w-full min-w-0 p-4 sm:p-6 lg:p-10 relative z-10">
          {/* Header */}
          <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
            <div>
              <p className="text-white/50 text-base sm:text-lg">
                Welcome back,
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mt-2 break-words">
                {user.name}
              </h1>
            </div>

            <Link
              to="/projects"
              className="w-full sm:w-auto text-center px-5 sm:px-7 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.02] transition"
            >
              View Projects
            </Link>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[28px] p-5 sm:p-6 hover:bg-white/[0.05] transition"
              >
                <p className="text-white/40 text-sm">
                  {stat.title}
                </p>

                <h2 className="text-4xl sm:text-5xl font-semibold mt-4 break-words">
                  {stat.value}
                </h2>
              </div>
            ))}
          </section>

          {/* Main Grid */}
          <section className="grid grid-cols-1 2xl:grid-cols-[1.5fr_0.8fr] gap-6 mt-8">
            {/* Recent Tasks */}
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Recent Tasks
                  </h2>

                  <p className="text-white/40 text-sm mt-1">
                    Latest workspace activity
                  </p>
                </div>

                <Link
                  to="/my-tasks"
                  className="text-sm text-indigo-400 hover:text-indigo-300"
                >
                  View all
                </Link>
              </div>

              <div className="divide-y divide-white/10">
                {tasks.length === 0 ? (
                  <p className="p-6 text-white/50">
                    No tasks found
                  </p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-4 sm:p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 hover:bg-white/[0.03] transition"
                    >
                      <div className="min-w-0">
                        <h3 className="text-lg font-medium break-words">
                          {task.title}
                        </h3>

                        <p className="text-sm text-white/40 mt-2 break-words">
                          {task.project?.name ||
                            "No Project"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 rounded-full text-xs border border-white/10 bg-white/[0.03]">
                          {task.status}
                        </span>

                        <span className="px-4 py-2 rounded-full text-xs bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 text-indigo-300">
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] p-4 sm:p-6">
              <h2 className="text-2xl font-semibold mb-8">
                Task Overview
              </h2>

              <div className="space-y-7">
                {stats.slice(1, 3).map((stat) => (
                  <div key={stat.title}>
                    <div className="flex justify-between text-sm mb-3 gap-4">
                      <span className="text-white/50 break-words">
                        {stat.title}
                      </span>

                      <span>{stat.value}</span>
                    </div>

                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        style={{
                          width: `${
                            stats[0].value
                              ? (stat.value /
                                  stats[0].value) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Focus Card */}
              <div className="mt-10 border border-white/10 bg-white/[0.03] rounded-3xl p-5 sm:p-6">
                <p className="text-white/40 text-sm">
                  Current Focus
                </p>

                <h3 className="text-2xl sm:text-3xl font-semibold mt-3 leading-tight break-words">
                  Backend API Integration
                </h3>

                <p className="text-white/50 mt-4 leading-relaxed text-sm sm:text-base">
                  Continue improving workflow performance
                  and dashboard interactions.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;