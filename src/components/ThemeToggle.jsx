import React, { useState, useEffect } from "react";
import { enable as enableDarkMode, disable as disableDarkMode } from "darkreader";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") === "dark";
    setIsDark(savedTheme);
    if (savedTheme) enableDarkMode();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      disableDarkMode();
      localStorage.setItem("theme", "light");
    } else {
      enableDarkMode({
        brightness: 100,
        contrast: 90,
        sepia: 10,
      });
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <div className="d-flex align-items-center">
      <span className="me-2 text-white">{isDark ? "🌙" : "💡"}</span>
      <label className="switch">
        <input type="checkbox" checked={isDark} onChange={toggleTheme} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;
