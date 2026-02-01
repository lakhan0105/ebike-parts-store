export const Card = ({ children, className = '', hover = false }) => {
    return (
        <div
            className={`
        bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export const CardImage = ({ src, alt, className = '' }) => {
    return (
        <div className={`w-full aspect-square overflow-hidden bg-gray-100 ${className}`}>
            <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export const CardContent = ({ children, className = '' }) => {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
};
