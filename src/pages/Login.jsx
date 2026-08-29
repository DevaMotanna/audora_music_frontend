import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex lg:items-stretch page-enter">
      {/* Left Branding Panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-audora-accent via-audora-bg to-audora-green opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-audora-green/20 rounded-full blur-2xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white text-xl">♪</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">Audora</span>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-display text-4xl font-black text-white mb-4 leading-tight">
            Your music,<br />everywhere you go.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Stream millions of songs, build playlists, and share what you love — all in one place.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              "🎵 High-quality streaming",
              "🎧 Offline downloads",
              "💜 Personalized playlists",
              "🔀 Smart shuffle & repeat",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                <span className="text-white/80 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/40 text-xs">
          © 2024 Audora. All rights reserved.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-audora-accent to-audora-green flex items-center justify-center shadow-glow">
              <span className="text-white">♪</span>
            </div>
            <span className="font-display text-xl font-bold text-white">Audora</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-audora-muted mb-8">Log in to continue your music journey.</p>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-audora-muted font-medium block mb-1.5" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-audora-muted font-medium block mb-1.5" htmlFor="login-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-audora-dim hover:text-white transition-colors text-xs"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-base py-3 mt-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-audora-muted mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-audora-accentLight hover:underline font-medium">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
