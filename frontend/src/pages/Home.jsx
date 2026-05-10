import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  Bell,
  Menu,
  X,
} from "lucide-react";

import { motion } from "framer-motion";
import { useState } from "react";

function Home() {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.email?.split("@")[0];

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Glow */}
      <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-violet-500/20 blur-[140px] rounded-full" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-violet-500/30">
              F
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Fluxo
              </h1>

              <p className="text-[10px] sm:text-xs text-white/40">
                Team Workspace
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8 text-sm">
            <Link
              to="/"
              className="text-white hover:text-violet-300 transition"
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className="text-white/60 hover:text-white transition"
            >
              Dashboard
            </Link>

            <Link
              to="/projects"
              className="text-white/60 hover:text-white transition"
            >
              Projects
            </Link>

            <Link
              to="/my-tasks"
              className="text-white/60 hover:text-white transition"
            >
              Tasks
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <div className="hidden lg:flex items-center gap-4 border border-white/10 bg-white/[0.03] backdrop-blur-xl rounded-2xl px-4 py-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-sm font-semibold">
                      {username?.[0]?.toUpperCase()}
                    </div>

                    <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {username}
                    </p>

                    <p className="text-xs text-white/40">
                      Active Workspace
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all duration-300 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-sm"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 font-medium shadow-lg shadow-violet-500/20 hover:scale-[1.03] transition-all duration-300 text-sm"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-2xl">
            <div className="px-4 py-6 flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                to="/projects"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Projects
              </Link>

              <Link
                to="/my-tasks"
                onClick={() => setMenuOpen(false)}
                className="text-white/80 hover:text-white"
              >
                Tasks
              </Link>

              {!token ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="mt-4 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] text-center"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-center font-medium"
                  >
                    Start Free
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.location.reload();
                  }}
                  className="mt-4 px-5 py-3 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-violet-500/20 bg-violet-500/10 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm text-violet-300 mb-8 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              Modern Productivity Platform
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1]">
              Build faster.
              <br />
              Collaborate smarter.
              <br />
              Manage everything.
            </h1>

            {/* Description */}
            <p className="mt-6 sm:mt-8 text-base sm:text-xl text-white/50 max-w-2xl leading-relaxed">
              Fluxo helps modern teams manage projects, track tasks,
              collaborate seamlessly and accelerate execution through a
              beautiful unified workspace.
            </p>

            {/* Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={token ? "/dashboard" : "/signup"}
                className="px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-violet-500/20"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/projects"
                className="px-6 sm:px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 text-center"
              >
                Explore Projects
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 sm:mt-14">
              {[
                ["250K+", "Tasks Managed"],
                ["98%", "Team Efficiency"],
                ["12K+", "Active Teams"],
              ].map(([value, label]) => (
                <div key={label}>
                  <h2 className="text-3xl sm:text-4xl font-semibold">
                    {value}
                  </h2>

                  <p className="text-white/40 text-sm mt-2">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-violet-500/20 rounded-full blur-[120px]" />

            <div className="relative border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[36px] overflow-hidden shadow-2xl shadow-black/40">
              {/* Top */}
              <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>

                <div className="text-sm text-white/30">
                  fluxo.app
                </div>
              </div>

              {/* Content */}
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
                      <h2 className="text-2xl font-semibold">
                        Workspace
                      </h2>

                      <p className="text-white/40 mt-1 text-sm">
                        Team productivity overview
                      </p>
                    </div>

                    <button className="w-11 h-11 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center">
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
                        <p className="text-white/40 text-sm">
                          {title}
                        </p>

                        <h2 className="text-3xl font-semibold mt-3">
                          {value}
                        </h2>
                      </div>
                    ))}
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
      className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 cursor-pointer ${
        active
          ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-violet-500/20"
          : "hover:bg-white/[0.05] text-white/60 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span>{text}</span>
    </div>
  );
}

export default Home;