import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="lg:hidden sticky top-0 z-50 glass border-b border-audora-border">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-audora-accent to-audora-green flex items-center justify-center shadow-glow">
            <span className="text-white text-sm">♪</span>
          </div>
          <span className="font-display font-bold text-white tracking-tight">Audora</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audora-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              id="mobile-search-input"
              className="w-full bg-white/8 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-audora-dim outline-none focus:border-audora-accent focus:ring-1 focus:ring-audora-accent/30 transition-all"
            />
          </div>
        </form>

        {/* User avatar / menu trigger */}
        {user ? (
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-audora-accent to-audora-pink flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          >
            {user.name?.[0]?.toUpperCase()}
          </button>
        ) : (
          <Link
            to="/login"
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-audora-accent text-white flex-shrink-0"
          >
            Login
          </Link>
        )}
      </div>

      {/* Dropdown user menu */}
      {menuOpen && user && (
        <div className="absolute right-4 top-14 glass-card rounded-xl border border-audora-border shadow-card w-48 py-2 z-50 animate-slide-up">
          <p className="px-4 py-2 text-xs text-audora-muted border-b border-audora-border mb-1 truncate">
            {user.email}
          </p>
          <button
            onClick={() => { logout(); setMenuOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
