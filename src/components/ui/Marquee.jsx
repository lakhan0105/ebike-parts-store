export const Marquee = ({ products = [] }) => {
    const displayProducts = [...products, ...products, ...products, ...products];
    if (products.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden">
            <div className="animate-marquee flex gap-4">
                {displayProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`}
                        className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50/50 border border-white/10 shadow-sm"
                    >
                        <img
                            src={product.image_url || 'https://via.placeholder.com/300?text=Product'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
