"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark"; // Changed to only support dark mode

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook to use the theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always use dark theme
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme - always dark
  useEffect(() => {
    setMounted(true);
      try {
      // Force dark theme
      localStorage.setItem("theme", "dark");
    } catch (_) {
      console.log("Could not access localStorage");
    }
  }, []);  // Apply theme changes to document
  const applyTheme = (_theme: Theme) => {
    try {
      // Always apply dark mode
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } catch (error) {
      console.log("Error applying theme", error);
    }
  };

  // Update document with theme changes
  useEffect(() => {
    if (!mounted) return;
    
    // Apply dark theme
    applyTheme(theme);
  }, [theme, mounted]);

  // Toggle function kept for compatibility but does nothing
  const toggleTheme = () => {
    // No-op - we always stay in dark mode
    console.log('Site is locked to dark mode');
  };
  
  // If not mounted yet, render a simplified version to avoid hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme, setTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}