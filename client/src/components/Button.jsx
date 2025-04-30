const Button = ({ type = "button", className = "", children, ...props }) => {
    return (
      <button
        type={type}
        className={`w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-3 rounded-xl hover:brightness-110 hover:scale-[1.01] active:scale-100 transition-all duration-200 shadow-lg ${className}`}
        {...props}
      >
        {children}
      </button>
    );
};
export default Button;
