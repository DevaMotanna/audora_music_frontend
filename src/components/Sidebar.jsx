import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
<<<<<<< HEAD
import { handleImgError } from "../utils/image";
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46

const NAV_ITEMS = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/search", icon: SearchIcon, label: "Search" },
  { to: "/playlists", icon: LibraryIcon, label: "Library", auth: true },
  { to: "/liked", icon: HeartIcon, label: "Liked Songs", auth: true },
];

function HomeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { currentTrack } = usePlayer();
  const location = useLocation();

  return (
<<<<<<< HEAD
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-full sticky top-0 glass border-r border-audora-border overflow-y-auto">
=======
    <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 glass border-r border-audora-border">
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-audora-accent to-audora-green flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <span className="text-white text-lg">♪</span>
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">Audora</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 space-y-1 overflow-y-auto">
        <p className="px-4 pt-2 pb-1 text-xs font-semibold text-audora-dim uppercase tracking-wider">Menu</p>
        {NAV_ITEMS.map((item) => {
          if (item.auth && !user) return null;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? "nav-link-active" : "nav-link"}
            >
              <item.icon />
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-audora-accent" />}
            </Link>
          );
        })}

        {/* Currently Playing mini widget */}
        {currentTrack && (
          <div className="mt-4 mx-2">
            <p className="text-xs font-semibold text-audora-dim uppercase tracking-wider mb-2 px-2">Now Playing</p>
            <div className="glass-card rounded-xl p-3 flex items-center gap-2">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
<<<<<<< HEAD
                onError={handleImgError}
=======
>>>>>>> 570b2c07dec63fb8d4465ce7f8b48bd8b9216b46
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-audora-muted truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-end gap-0.5 ml-auto flex-shrink-0">
                {[1,2,3].map(i => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.15}s`, height: `${8 + i * 4}px` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* User section at bottom */}
      <div className="p-4 border-t border-audora-border">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-audora-accent to-audora-pink flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-audora-muted truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-audora-dim hover:text-red-400 transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link to="/register" className="btn-primary w-full text-center block text-sm">
              Sign up free
            </Link>
            <Link to="/login" className="btn-secondary w-full text-center block text-sm">
              Log in
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
