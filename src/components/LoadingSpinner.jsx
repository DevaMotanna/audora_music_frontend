import React from "react";

const LoadingSpinner = ({ size = "md", text = "" }) => {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-audora-accent border-t-transparent animate-spin" />
        <div className="absolute inset-1 rounded-full border border-audora-accentLight/30 border-b-transparent animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
      </div>
      {text && <p className="text-audora-muted text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
