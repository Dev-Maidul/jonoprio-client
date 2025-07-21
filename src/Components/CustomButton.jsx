// CustomButton.jsx
import React from "react";
import { Link } from "react-router-dom";

const colorMap = {
  blue: {
    gradient: "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600",
    hover: "hover:bg-blue-600",
  },
  green: {
    gradient: "bg-gradient-to-r from-green-500 via-green-400 to-green-600",
    hover: "hover:bg-green-600",
  },
  red: {
    gradient: "bg-gradient-to-r from-red-500 via-red-400 to-red-600",
    hover: "hover:bg-red-600",
  },
  gray: {
    gradient: "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600",
    hover: "hover:bg-gray-600",
  },
};

const CustomButton = ({
  text = "Button",
  icon,
  to,
  onClick,
  color = "blue",
  className = "",
  type = "button",
  disabled = false,
  ...rest
}) => {
  const colors = colorMap[color] || colorMap.blue;

  const content = (
    <span className="flex items-center justify-center w-full gap-1">
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="whitespace-nowrap">{text}</span>
    </span>
  );

  const baseClasses = `
    ${colors.gradient} ${colors.hover}
    transition-all duration-300
    rounded-md
    text-white font-semibold
    focus:outline-none
    focus:ring-2 focus:ring-offset-2
    flex items-center justify-center
    ${className}
    ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
  `;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disabled}
      {...rest}
    >
      {content}
    </button>
  );
};

export default CustomButton;