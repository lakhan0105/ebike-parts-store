import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Loading } from '../components/ui/Loading';
import { Marquee } from '../components/ui/Marquee';
import { categoryService } from '../services/categoryService';
import { productService } from '../services/productService';
import { Star, ChevronRight } from 'lucide-react';

export const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

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

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category_id === activeCategory);

    return (
        <Layout>
            {/* Simple Header Banner */}
            <div className="bg-slate-900 py-2.5">
                <div className="max-w-[1400px] mx-auto px-4 text-center md:text-left">
                    <p className="text-white text-[10px] md:text-xs font-medium uppercase tracking-[0.1em]">Welcome to E-Bike Store | Free shipping on orders over <span className="text-orange-400 font-bold">₹10,000</span></p>
                </div>
            </div>

            {/* Compact Marquee Section */}
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 py-6 md:py-10">
                <div className="max-w-[1400px] mx-auto px-4">
                    <div className="bg-white/95 backdrop-blur shadow-2xl rounded-2xl md:rounded-[2rem] p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4 px-2">
                            {/* <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest">Today's Deals</h2> */}
                            {/* <span className="text-[10px] text-orange-600 font-bold underline cursor-pointer">View All</span> */}
                        </div>
                        <Marquee products={products.slice(0, 8)} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-4 py-4">
                {/* Mobile Categories - Horizontal Scroll (Moved outside main flex for easier stacking) */}
                <div className="md:hidden mb-4 overflow-x-auto no-scrollbar border-b border-gray-200">
                    <div className="flex gap-2 pb-4">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all ${activeCategory === 'all'
                                ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                : 'bg-white text-gray-700 border-gray-300'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all ${activeCategory === category.id
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                                    : 'bg-white text-gray-700 border-gray-300'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Categories (Desktop Only) */}
                    <div className="hidden md:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-24">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Department</h3>
                            </div>
                            <div className="py-2">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between group ${activeCategory === 'all' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700'
                                        }`}
                                >
                                    All Products
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === 'all' ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between group ${activeCategory === category.id ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700'
                                            }`}
                                    >
                                        {category.name}
                                        <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === category.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'item' : 'items'}
                            </p>
                            <div className="text-xs text-gray-400">
                                Results for <span className="text-gray-900 font-medium">"{activeCategory === 'all' ? 'All Departments' : categories.find(c => c.id === activeCategory)?.name}"</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            {filteredProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-200 transition-all duration-300 group flex flex-col h-full"
                                >
                                    <div className="aspect-square bg-gray-50 overflow-hidden rounded-t-xl relative">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {product.price > 10000 && (
                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-[10px] font-black text-white rounded uppercase shadow-lg">
                                                Best Choice
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="flex items-center gap-1 mb-3">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-blue-600 font-bold ml-1">452</span>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 line-through">₹{(product.price * 1.25).toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] text-green-600 font-bold">
                                                FREE delivery by tomorrow
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChevronRight className="w-8 h-8 text-gray-300 rotate-90" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No matching parts</h3>
                                <p className="text-sm text-gray-500 mb-6">We couldn't find any products in this category at the moment.</p>
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-colors"
                                >
                                    View All Products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};