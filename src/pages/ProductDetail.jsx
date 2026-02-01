import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

export const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getById(id);
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <Layout><Loading fullScreen /></Layout>;
    if (error) return <Layout><div className="text-center py-12 text-red-600">Error: {error}</div></Layout>;
    if (!product) return <Layout><div className="text-center py-12">Product not found</div></Layout>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        Home
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link to={`/category/${product.category_id}`} className="text-blue-600 hover:text-blue-700">
                        {product.categories?.name}
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <img
                            src={product.image_url || 'https://via.placeholder.com/600?text=No+Image'}
                            alt={product.name}
                            className="w-full aspect-square object-cover"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-blue-600">
                                ₹{product.price.toLocaleString()}
                            </span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.description || 'No description available'}
                            </p>
                        </div>

                        <div className="mb-6">
                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {product.categories?.name}
                            </span>
                        </div>

                        <div className="mt-auto">
                            <Button
                                onClick={handleAddToCart}
                                size="large"
                                className="w-full sm:w-auto"
                            >
                                {added ? (
                                    <>
                                        <Check className="w-5 h-5 mr-2 inline" />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2 inline" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
