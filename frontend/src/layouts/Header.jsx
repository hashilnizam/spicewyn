import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useThemeStore } from '@/store/themeStore';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { isAuthenticated, user, logout } = useAuthStore();
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { theme, toggleTheme } = useThemeStore();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 shadow-md">
      <div className="container-custom">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              SpiceWyn
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for spices, blends, herbs..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-800"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Wishlist */}
            <Link
              to={isAuthenticated ? '/profile?tab=wishlist' : '/login'}
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <User className="w-6 h-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    My Orders
                  </Link>
                  {['admin', 'super_admin', 'staff'].includes(user?.role) && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <Link to="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
            All Products
          </Link>
          <Link to="/products?category=whole-spices" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Whole Spices
          </Link>
          <Link to="/products?category=ground-spices" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Ground Spices
          </Link>
          <Link to="/products?category=spice-blends" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Spice Blends
          </Link>
          <Link to="/products?featured=true" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Featured
          </Link>
          <Link to="/support" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            Support
          </Link>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 input"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>
          <nav className="flex flex-col p-4 space-y-2">
            <Link to="/products" className="py-2 text-gray-700 dark:text-gray-300">
              All Products
            </Link>
            <Link to="/products?category=whole-spices" className="py-2 text-gray-700 dark:text-gray-300">
              Whole Spices
            </Link>
            <Link to="/products?category=ground-spices" className="py-2 text-gray-700 dark:text-gray-300">
              Ground Spices
            </Link>
            <Link to="/support" className="py-2 text-gray-700 dark:text-gray-300">
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
