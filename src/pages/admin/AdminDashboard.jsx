import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { CategoryManager } from '../../components/admin/CategoryManager';
import { ProductManager } from '../../components/admin/ProductManager';
import { authService } from '../../services/authService';
import { LogOut } from 'lucide-react';

export const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.signOut();
            navigate('/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-gray-600 mt-1">Manage your store products and categories</p>
                    </div>
                    <Button variant="secondary" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2 inline" />
                        Logout
                    </Button>
                </div>

                {/* Category Management Section */}
                <div className="mb-8">
                    <CategoryManager />
                </div>

                {/* Product Management Section */}
                <div>
                    <ProductManager />
                </div>
            </div>
        </Layout>
    );
};
