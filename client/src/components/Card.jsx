const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`p-10 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-xl w-full max-w-md transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;


