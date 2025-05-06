const Input = ({ id, type, placeholder, onChange, value, name,  className, ...props }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value ?? ""}
            className={`px-4 py-2 border border-gray-400 rounded-3xl focus:outline-none w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-400 ${className}`}
            {...props}
        />
    );
};

export default Input;

