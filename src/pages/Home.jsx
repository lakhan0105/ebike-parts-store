import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/ui/Loading';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { FolderOpen } from 'lucide-react';

export const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesData, productsData] = await Promise.all([
                categoryService.getAll(),
                productService.getAll()
            ]);
            setCategories(categoriesData);
            setProducts(productsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Layout><Loading fullScreen /></Layout>;
    if (error) return <Layout><div className="text-center py-12 text-red-600">Error: {error}</div></Layout>;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                        Premium E-Bike Parts
                    </h1>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        High-quality electric bike parts for your journey
                    </p>
                </div>

                {/* Categories List */}
                <div className="mb-12">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">Shop by Category</h2>

                    {categories.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <FolderOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No categories found</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.id}`}
                                    className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 border border-gray-200 shadow-sm"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Products */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 px-1">Featured Products</h2>

                    {products.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No products available yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="group block bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                            {product.categories?.name}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-900">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                                                View
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};
