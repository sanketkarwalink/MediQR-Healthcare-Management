const Card = ({ children, className, onClick }) => {
  return (
      <div className={`p-10 border border-gray-200 shadow-2xl rounded-2xl w-full max-w-md ${className}`} onClick={onClick}>
          {children}
      </div>
  );
};

export default Card;

