import React from "react";
import PropTypes from "prop-types";

function Input({
  id,
  label,
  type = "text",
  placeholder,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyle =
    "w-full h-12 rounded-lg border border-border bg-base-100 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

  const paddingClass = Icon ? "pl-10 pr-4" : "px-4";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        )}
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className={`${baseStyle} ${paddingClass} ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.elementType,
};

export default Input;
