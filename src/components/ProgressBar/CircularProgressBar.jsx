import React from 'react';

const CircularProgressBar = ({ value }) => {
  const circumference = 2 * Math.PI * 25;
  const progressOffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative">
      <svg viewBox="0 0 50 50" className="block">
        <circle cx="25" cy="25" r="20" fill="none" stroke="#e6e6e6" strokeWidth="5"></circle>
        <circle cx="25" cy="25" r="20" fill="none" stroke="#43c97c" strokeWidth="5" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={progressOffset}></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">{value}%</div>
    </div>
  );
};

export default CircularProgressBar;
