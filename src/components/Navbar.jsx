import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'ADMIN':
        return <Link to="/admin" className="hover:text-primary">Admin Dashboard</Link>;
      case 'RESTAURANT_OWNER':
        return <Link to="/restaurant-dashboard" className="hover:text-primary">Restaurant Dashboard</Link>;
      case 'DELIVERY_AGENT':
        return <Link to="/delivery-dashboard" className="hover:text-primary">Delivery Dashboard</Link>;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            🍕 FoodDelivery
          </Link>
          <div className="flex items-center space-x-6">
            {/* Show "Restaurants" only if user.role is NOT 'RESTAURANT_OWNER' */}
            {(!user || user.role !== 'RESTAURANT_OWNER') && (
              <Link to="/restaurants" className="hover:text-primary">
                Restaurants
              </Link>
            )}
            {isAuthenticated ? (
              <>
                {getDashboardLink()}
                
                {user?.role === 'CUSTOMER' && (
                  <>
                    <Link to="/orders" className="hover:text-primary">
                      My Orders
                    </Link>
                    <Link to="/cart" className="relative hover:text-primary">
                      🛒 Cart
                      {getItemCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getItemCount()}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <span className="text-gray-600">Hi, {user?.firstName}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;