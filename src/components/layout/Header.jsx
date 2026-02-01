import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Bike, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { authService } from '../../services/authService';

export const Header = () => {
    const { getCartCount } = useCart();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const cartCount = getCartCount();

    useEffect(() => {
        // Check initial user
        authService.getCurrentUser().then(setUser);

        // Subscribe to auth changes
        const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await authService.signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group shrink-0">
                        <Bike className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                        <span className="text-xl font-bold text-gray-900 hidden xs:block">E-Bike Parts</span>
                    </Link>

                    <nav className="flex items-center space-x-4 md:space-x-6">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Home
                        </Link>

                        <Link
                            to="/cart"
                            className="relative flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 sm:-top-2 sm:-right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="w-px h-6 bg-gray-200 mx-2"></div>

                        {user ? (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/admin/dashboard"
                                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                                    title="Dashboard"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/admin"
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center"
                                title="Admin Login"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline ml-1">Admin</span>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};
