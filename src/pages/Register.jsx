import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-red-500", "bg-yellow-400", "bg-audora-green"];
  const strengthLabels = ["", "Too short", "Good", "Strong"];

  return (
    <div className="min-h-screen flex lg:items-stretch page-enter">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-audora-green via-audora-bg to-audora-accent opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-16 right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-16 left-10 w-56 h-56 bg-audora-accent/15 rounded-full blur-2xl" />
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
            Start your<br />music journey.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create a free account and unlock a world of music at your fingertips.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: "16+", sub: "Genres available" },
              { label: "Free", sub: "Always free to use" },
              { label: "HD", sub: "High-quality audio" },
              { label: "∞", sub: "Unlimited playlists" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-white">{stat.label}</p>
                <p className="text-white/60 text-xs mt-0.5">{stat.sub}</p>
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

          <h1 className="font-display text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-audora-muted mb-8">Join Audora and start streaming music.</p>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3 mb-5 text-red-400 text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-audora-muted font-medium block mb-1.5" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-audora-muted font-medium block mb-1.5" htmlFor="reg-email">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm text-audora-muted font-medium block mb-1.5" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColors[strength] : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-audora-dim">{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full text-base py-3 mt-2 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-audora-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-audora-accentLight hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
