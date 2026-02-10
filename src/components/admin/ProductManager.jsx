import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Loading } from '../ui/Loading';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';

export const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category_id: '',
        image_url: '',
        stock: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(10);

    // Filter products based on search term
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Visible products for lazy loading
    const visibleProducts = filteredProducts.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setVisibleCount(10); // Reset pagination on search
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                productService.getAll(),
                categoryService.getAll()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        try {
            let imageUrl = formData.image_url;

            // Upload new image if selected
            if (imageFile) {
                imageUrl = await productService.uploadImage(imageFile);
            }

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                image_url: imageUrl
            };

            if (editingId) {
                await productService.update(editingId, productData);
            } else {
                await productService.create(productData);
            }

            resetForm();
            loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            category_id: product.category_id,
            image_url: product.image_url || '',
            stock: product.stock?.toString() || '0'
        });
        setEditingId(product.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.delete(id);
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            category_id: '',
            image_url: '',
            stock: ''
        });
        setImageFile(null);
        setShowForm(false);
        setEditingId(null);
        setError('');
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
            <div className="flex flex-col gap-4 mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Products ({products.length})</h2>
                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} size="small">
                            <Plus className="w-4 h-4 mr-2 inline" />
                            Add Product
                        </Button>
                    )}
                </div>

                {/* Search Bar */}
                {!showForm && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-2.5 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                        {editingId ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., 48V 1000W Motor"
                            required
                        />

                        <Input
                            type="number"
                            label="Price (₹)"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="e.g., 5000"
                            required
                            min="0"
                            step="0.01"
                        />

                        <Input
                            type="number"
                            label="Stock Quantity"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="e.g., 50"
                            required
                            min="0"
                        />

                        <div className="md:col-span-2">
                            <Textarea
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product description..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Image
                            </label>
                            <label className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">{imageFile ? imageFile.name : 'Choose file'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {formData.image_url && !imageFile && (
                                <p className="text-xs text-gray-600 mt-1">Current: {formData.image_url.split('/').pop()}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                        <Button type="submit" disabled={uploading} size="small">
                            {uploading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="secondary" size="small" onClick={resetForm}>
                            Cancel
                        </Button>
                    </div>
                </form>
            )}

            {products.length === 0 ? (
                <p className="text-gray-600 text-center py-8 text-sm">No products yet. Add your first product!</p>
            ) : filteredProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No products match your search.</p>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Image</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleProducts.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <img
                                                src={product.image_url || 'https://via.placeholder.com/80?text=No+Image'}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-900">{product.name}</td>
                                        <td className="py-3 px-4 text-sm font-semibold text-blue-600">₹{product.price.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                                                product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {product.stock || 0} in stock
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{product.categories?.name}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    {/* Mobile Compact List View */}
                    <div className="md:hidden space-y-2">
                        {visibleProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg p-2 border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img
                                        src={product.image_url || 'https://via.placeholder.com/80?text=No+Image'}
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded flex-shrink-0 bg-gray-100"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-sm text-gray-900 truncate pr-2">{product.name}</h3>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-bold text-blue-600">₹{product.price.toLocaleString()}</span>
                                            <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-green-500' :
                                                    product.stock > 0 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}></span>
                                            <span className="text-gray-400 truncate max-w-[80px]">{product.categories?.name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-1.5 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-1.5 text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {visibleCount < filteredProducts.length && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                Load More ({filteredProducts.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
