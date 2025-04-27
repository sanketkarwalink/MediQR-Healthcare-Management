const Label = ({ htmlFor, children, className }) => {
    return (
        <label htmlFor={htmlFor} className={`block text-gray-700 font-semibold mb-2 text-md ${className}`}>
            {children}
        </label>
    );
};

export default Label;


