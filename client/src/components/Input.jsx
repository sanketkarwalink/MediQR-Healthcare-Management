const Input = ({ id, type, placeholder, onChange, value, name,  className, ...props }) => {
    return (
        <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            value={value ?? ""}
            className={`p-3 border rounded-lg w-full focus:border-blue-500 focus:ring focus:ring-blue-300 ${className}`}
            {...props}
        />
    );
};

export default Input;

