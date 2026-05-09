import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const res = await API.post("/auth/signup", formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center px-4 py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#312e81,transparent_35%)] opacity-40" />

      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* Glow */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 border border-white/10 bg-white/[0.03] backdrop-blur-2xl rounded-[32px] overflow-hidden shadow-2xl shadow-black/40">
        {/* Left Side */}
        <div className="p-6 sm:p-10 lg:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg">
                  F
                </div>

                <div className="text-left">
                  <h1 className="text-2xl font-semibold">Fluxo</h1>

                  <p className="text-xs text-white/40">
                    Team Workspace
                  </p>
                </div>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-10">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Create Account
              </h2>

              <p className="text-white/50 mt-4 text-lg">
                Start building and managing projects with your team.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 px-4 py-4 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-white/60 mb-3">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-3">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <div>
                <label className="block text-sm text-white/60 mb-3">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 py-4 font-medium hover:scale-[1.01] transition disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center mt-8 text-white/50">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-white font-semibold hover:text-indigo-400 transition"
              >
                Login
              </Link>
            </p>

            <p className="text-center mt-5">
              <Link
                to="/"
                className="text-sm text-white/40 hover:text-white transition"
              >
                Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex flex-col justify-between border-l border-white/10 p-14">
          <div>
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-12">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
                F
              </div>

              <div>
                <h1 className="text-2xl font-semibold">Fluxo</h1>

                <p className="text-xs text-white/40">
                  Team Productivity Platform
                </p>
              </div>
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 rounded-full px-4 py-2 text-sm text-indigo-300 mb-10">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Modern Team Collaboration
            </div>

            {/* Heading */}
            <h1 className="text-6xl font-semibold tracking-tight leading-[1]">
              Build workflows
              <br />
              your team
              <br />
              actually enjoys.
            </h1>

            <p className="mt-8 text-white/60 text-lg leading-relaxed max-w-lg">
              Organize projects, assign tasks, collaborate in real time and
              manage productivity through one unified workspace.
            </p>
          </div>

          {/* Bottom Cards */}
          <div className="grid grid-cols-2 gap-5 mt-10">
            <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-6">
              <p className="text-white/40 text-sm">Projects Created</p>

              <h2 className="text-5xl font-semibold mt-3">24+</h2>
            </div>

            <div className="border border-white/10 bg-white/[0.03] rounded-3xl p-6">
              <p className="text-white/40 text-sm">Active Teams</p>

              <h2 className="text-5xl font-semibold mt-3">12K+</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;