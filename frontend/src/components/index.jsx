import classNames from "classnames";

// Button Component
export const Button = ({ className, children, ...props }) => {
  return (
    <button
      className={classNames(
        "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md font-medium shadow-md hover:from-purple-600 hover:to-indigo-500 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ className, children }) => {
  return (
    <div className={classNames(
      "bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300",
      className
    )}>
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ className, children }) => {
  return <div className={classNames("p-6 border-b border-gray-200", className)}>{children}</div>;
};

// CardFooter Component
export const CardFooter = ({ className, children }) => {
  return <div className={classNames("p-6 border-t border-gray-200", className)}>{children}</div>;
};

// CardTitle Component
export const CardTitle = ({ className, children }) => {
  return <h3 className={classNames("text-xl font-semibold text-gray-800", className)}>{children}</h3>;
};

// CardDescription Component
export const CardDescription = ({ className, children }) => {
  return <p className={classNames("text-sm text-gray-600 mt-2", className)}>{children}</p>;
};
