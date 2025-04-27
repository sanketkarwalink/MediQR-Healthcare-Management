const Button = ({ type, className, children, ...props }) => {
    return (
        <button
            type={type}
            className={`w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
