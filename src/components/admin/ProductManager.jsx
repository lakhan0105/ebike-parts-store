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
        image_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');

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
            image_url: product.image_url || ''
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
            image_url: ''
        });
        setImageFile(null);
        setShowForm(false);
        setEditingId(null);
        setError('');
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Products</h2>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} size="small">
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Add Product
                    </Button>
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
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Image</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
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
            )}
        </div>
    );
};
