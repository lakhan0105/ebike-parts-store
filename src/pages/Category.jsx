import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card, CardImage, CardContent } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { Package } from 'lucide-react';

export const Category = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoryData] = await Promise.all([
                productService.getByCategory(id),
                categoryService.getById(id)
            ]);
            setProducts(productsData);
            setCategory(categoryData);
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        Home
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">{category?.name}</span>
                </nav>

                {/* Category Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {category?.name}
                    </h1>
                    <p className="text-gray-600">
                        {products.length} {products.length === 1 ? 'product' : 'products'} available
                    </p>
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No products in this category yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <Link key={product.id} to={`/product/${product.id}`}>
                                <Card hover className="h-full">
                                    <CardImage
                                        src={product.image_url || 'https://via.placeholder.com/400?text=No+Image'}
                                        alt={product.name}
                                    />
                                    <CardContent>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{product.price.toLocaleString()}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};
