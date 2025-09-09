import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blog-primary to-blog-secondary p-1 transition-all duration-300 hover:scale-105 hover:shadow-lg"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg"
        animate={{
          x: theme === "light" ? -6 : 18,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            rotate: theme === "light" ? 0 : 180,
            scale: theme === "light" ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          {theme === "light" ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-blog-primary" />
          )}
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium text-white">
        <span
          className={`transition-opacity duration-300 ${theme === "light" ? "opacity-0" : "opacity-100"}`}
        >
          <Sun className="h-3 w-3" />
        </span>
        <span
          className={`transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
        >
          <Moon className="h-3 w-3" />
        </span>
      </div>
    </motion.button>
  );
};
