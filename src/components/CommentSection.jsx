import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const formatRelTime = (dateStr) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return "";
  }
};

const CommentSection = ({ trackId, comments: initial, onCommentAdded }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post(`/tracks/${trackId}/comments`, { text });
      onCommentAdded(res.data);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-lg font-semibold text-white">
          Comments
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-audora-muted font-medium">
          {initial.length}
        </span>
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-audora-accent to-audora-pink flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-0.5">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <input
                id="comment-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 input-field text-sm rounded-full"
                maxLength={500}
              />
              <button
                id="comment-submit-btn"
                type="submit"
                disabled={submitting || !text.trim()}
                className="btn-primary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Posting
                  </span>
                ) : "Post"}
              </button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1 pl-2">{error}</p>}
          </div>
        </form>
      ) : (
        <div className="glass-card rounded-xl p-4 mb-6 text-center">
          <p className="text-audora-muted text-sm">
            <a href="/login" className="text-audora-accentLight hover:underline font-medium">Log in</a> to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {initial.length === 0 && (
          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-audora-muted text-sm">No comments yet — be the first to say something!</p>
          </div>
        )}

        {[...initial].reverse().map((c) => (
          <div
            key={c._id}
            className="glass-card rounded-xl p-4 flex gap-3 animate-fade-in"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-audora-surfaceHigh to-audora-dim flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {c.user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-sm font-semibold text-white">{c.user?.name || "Anonymous"}</span>
                {c.createdAt && (
                  <span className="text-xs text-audora-dim">{formatRelTime(c.createdAt)}</span>
                )}
              </div>
              <p className="text-sm text-audora-text leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
