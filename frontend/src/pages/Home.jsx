import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  Users,
  Zap,
  BarChart3,
  Bell,
} from "lucide-react";

import { motion } from "framer-motion";

function Home() {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.email?.split("@")[0];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
              F
            </div>

            <div>
              <h1 className="text-xl font-semibold">Fluxo</h1>
              <p className="text-xs text-white/40">Team Workspace</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center gap-8 text-white/60 text-sm">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>

            <Link to="/dashboard" className="hover:text-white transition">
              Dashboard
            </Link>

            <Link to="/projects" className="hover:text-white transition">
              Projects
            </Link>

            <Link to="/my-tasks" className="hover:text-white transition">
              My Tasks
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <div className="hidden md:flex items-center gap-3 border border-white/10 bg-white/[0.03] rounded-2xl px-4 py-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-semibold">
                    {username?.[0]?.toUpperCase()}
                  </div>

                  <span className="text-sm text-white/70">{username}</span>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-5 py-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>

                <Link
                  to="/dashboard"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.03] transition"
                >
                  Open App
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-3 rounded-2xl border border-white/10 hover:bg-white/[0.04] transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium hover:scale-[1.03] transition"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 rounded-full px-4 py-2 text-sm text-indigo-300 mb-8">
              <Zap size={16} />
              AI Powered Productivity Platform
            </div>

            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[0.95]">
              Manage work
              <br />
              at startup speed.
            </h1>

            <p className="mt-8 text-xl text-white/60 max-w-2xl leading-relaxed">
              Fluxo helps fast-moving teams organize projects, track progress,
              collaborate in real time and ship faster with a beautiful modern
              workspace.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={token ? "/dashboard" : "/signup"}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/projects"
                className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/[0.04] transition text-center"
              >
                Explore Projects
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14">
              {[
                ["250K+", "Tasks Managed"],
                ["98%", "Team Efficiency"],
                ["12K+", "Active Teams"],
              ].map(([value, label]) => (
                <div key={label}>
                  <h2 className="text-3xl font-semibold">{value}</h2>
                  <p className="text-white/40 text-sm mt-2">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-500/20 rounded-full blur-[120px]" />

            <div className="relative border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl shadow-black/40">
              {/* Window top */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                <div className="text-sm text-white/40">
                  fluxo.app/dashboard
                </div>
              </div>

              <div className="grid grid-cols-[220px_1fr] min-h-[620px]">
                {/* Sidebar */}
                <div className="border-r border-white/10 p-6">
                  <div className="space-y-3">
                    <Link to="/dashboard">
                      <SidebarItem
                        icon={LayoutDashboard}
                        text="Dashboard"
                        active
                      />
                    </Link>

                    <Link to="/projects">
                      <SidebarItem
                        icon={FolderKanban}
                        text="Projects"
                      />
                    </Link>

                    <Link to="/my-tasks">
                      <SidebarItem
                        icon={CheckCircle2}
                        text="Tasks"
                      />
                    </Link>


                  </div>
                </div>

                {/* Main */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold">Workspace</h2>
                      <p className="text-white/40 mt-1 text-sm">
                        Team productivity overview
                      </p>
                    </div>

                    <button className="w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/[0.04] transition">
                      <Bell size={18} />
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Projects", "24"],
                      ["Completed", "186"],
                      ["In Review", "18"],
                      ["Members", "42"],
                    ].map(([title, value]) => (
                      <div
                        key={title}
                        className="border border-white/10 bg-white/[0.03] rounded-3xl p-5"
                      >
                        <p className="text-white/40 text-sm">{title}</p>

                        <h2 className="text-3xl font-semibold mt-3">
                          {value}
                        </h2>
                      </div>
                    ))}
                  </div>

                  {/* Activity */}
                  <div className="mt-6 border border-white/10 bg-white/[0.03] rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-semibold text-lg">
                        Recent Activity
                      </h3>

                      <span className="text-sm text-indigo-400">
                        Live Updates
                      </span>
                    </div>

                    <div className="space-y-4">
                      {[
                        "Dashboard redesign completed",
                        "API integration finished",
                        "New member joined workspace",
                        "Mobile UI deployed",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between border border-white/10 rounded-2xl px-4 py-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-400" />

                            <span className="text-sm">{item}</span>
                          </div>

                          <span className="text-xs text-white/30">
                            Now
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function SidebarItem({ icon: Icon, text, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition cursor-pointer ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-violet-500"
          : "hover:bg-white/[0.04] text-white/70"
      }`}
    >
      <Icon size={18} />

      <span>{text}</span>
    </div>
  );
}

export default Home;