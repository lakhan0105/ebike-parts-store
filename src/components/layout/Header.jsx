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
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex items-center justify-between h-14 md:h-16">
                    <Link to="/" className="flex items-center space-x-2 group shrink-0">
                        <div className="bg-orange-500 p-1.5 rounded-lg">
                            <Bike className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <span className="text-lg md:text-xl font-black text-gray-900 tracking-tighter uppercase italic">E-Bike<span className="text-orange-500">Store</span></span>
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
