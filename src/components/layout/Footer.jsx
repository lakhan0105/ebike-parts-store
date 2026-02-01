export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center text-gray-600">
                    <p className="text-sm">
                        © {new Date().getFullYear()} E-Bike Parts Store. All rights reserved.
                    </p>
                    <p className="text-xs mt-2 text-gray-500">
                        Quality electric bike parts for your journey
                    </p>
                </div>
            </div>
        </footer>
    );
};
