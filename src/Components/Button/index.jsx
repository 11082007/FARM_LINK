import React from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

function Button({
  type = "button",
  children,
  variant = "primary",
  className = "",
  isLoading = false,
  ...props
}) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
    outline:
      "border-2 border-primary text-primary hover:bg-primary-dark hover:text-white hover:border-primary-dark",
    ghost: "text-neutral hover:bg-secondary/10 hover:text-secondary",
    destructive: "bg-destructive text-destructive-foreground hover:bg-red-700",
  };

  const combinedClassName = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <button
      className={combinedClassName}
      type={type}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "outline", "ghost", "destructive"]),
  className: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default Button;
