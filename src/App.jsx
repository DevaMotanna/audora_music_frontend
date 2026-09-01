import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import PlayerBar from "./components/PlayerBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TrackDetail from "./pages/TrackDetail";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import LikedSongs from "./pages/LikedSongs";
import Genre from "./pages/Genre";

const App = () => {
  return (
    <div className="h-screen flex flex-col bg-audora-bg text-audora-text overflow-hidden">
      {/* Mobile top navbar */}
      <Navbar />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-36 lg:pb-28 min-h-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track/:id" element={<TrackDetail />} />
            <Route path="/genre/:genre" element={<Genre />} />
            <Route
              path="/playlists"
              element={
                <ProtectedRoute>
                  <Playlists />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playlists/:id"
              element={
                <ProtectedRoute>
                  <PlaylistDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/liked"
              element={
                <ProtectedRoute>
                  <LikedSongs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Mobile bottom nav (above player) */}
      <MobileNav />

      {/* Player bar (fixed bottom) */}
      <PlayerBar />
    </div>
  );
};

export default App;
