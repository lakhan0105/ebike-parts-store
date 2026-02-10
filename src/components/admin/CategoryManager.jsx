import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loading } from '../ui/Loading';
import { categoryService } from '../../services/categoryService';
import { Pencil, Trash2, Plus } from 'lucide-react';

export const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (editingId) {
                await categoryService.update(editingId, formData);
            } else {
                await categoryService.create(formData);
            }

            setFormData({ name: '' });
            setShowForm(false);
            setEditingId(null);
            loadCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name });
        setEditingId(category.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoryService.delete(id);
            loadCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setFormData({ name: '' });
        setShowForm(false);
        setEditingId(null);
        setError('');
    };

    if (loading) return <Loading />;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Categories</h2>
                {!showForm && (
                    <Button onClick={() => setShowForm(true)} size="small">
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Add Category
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
                        {editingId ? 'Edit Category' : 'Add New Category'}
                    </h3>
                    <div className="space-y-4">
                        <Input
                            label="Category Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Motors, Batteries, Controllers"
                            required
                        />
                        <div className="flex space-x-2">
                            <Button type="submit" size="small">
                                {editingId ? 'Update' : 'Create'}
                            </Button>
                            <Button type="button" variant="secondary" size="small" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            )}

            {categories.length === 0 ? (
                <p className="text-gray-600 text-center py-8 text-sm">No categories yet. Add your first category!</p>
            ) : (
                <div className="overflow-x-auto -mx-3 md:mx-0">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Category Name</th>
                                    <th className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm text-gray-900">{category.name}</td>
                                        <td className="py-2 md:py-3 px-2 md:px-4 text-right">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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
                </div>
            )}
        </div>
    );
};
