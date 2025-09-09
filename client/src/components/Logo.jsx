import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Logo = ({ size = "default", showText = true, className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const textSizes = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blog-primary via-blog-secondary to-blog-accent rounded-2xl blur-sm opacity-75 ${sizeClasses[size]}`}
        ></div>

        <div
          className={`relative bg-gradient-to-br from-blog-primary via-blog-secondary to-blog-accent ${sizeClasses[size]} rounded-2xl flex items-center justify-center shadow-xl overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-white rounded-full"></div>
          </div>

          <span
            className={`relative font-bold text-white ${size === "xl" ? "text-4xl" : size === "large" ? "text-3xl" : size === "small" ? "text-lg" : "text-2xl"} drop-shadow-lg`}
          >
            B
          </span>

          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </div>
      </motion.div>

      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <span
            className={`font-poppins font-bold gradient-text leading-none ${textSizes[size]}`}
          >
            BlogSpace
          </span>
          {size === "large" || size === "xl" ? (
            <span className="text-xs text-muted-foreground font-medium tracking-wider">
              CREATE • SHARE • INSPIRE
            </span>
          ) : null}
        </motion.div>
      )}
    </Link>
  );
};

export default Logo;
