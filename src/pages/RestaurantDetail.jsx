import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { restaurantAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        restaurantAPI.getById(id),
        restaurantAPI.getMenu(id),
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      toast.error('Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      return;
    }
    
    const added = addItem(item, restaurant);
    if (added) {
      toast.success(`${item.name} added to cart`);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!restaurant) {
    return <div className="text-center py-10">Restaurant not found</div>;
  }

  return (
    <div>
      <div className="card mb-8">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {restaurant.imageUrl ? (
              <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl">🍽️</span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-gray-600 mb-2">{restaurant.cuisineType}</p>
            <p className="text-gray-500 mb-2">{restaurant.address}</p>
            <p className="text-gray-500">{restaurant.phone}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500">⭐</span>
              <span className="ml-1">{restaurant.rating?.toFixed(1) || 'New'}</span>
            </div>
          </div>
        </div>
        {restaurant.description && (
          <p className="mt-4 text-gray-600">{restaurant.description}</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      {menuItems.length === 0 ? (
        <p className="text-center text-gray-600">No menu items available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="card flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="text-primary font-bold">${item.price?.toFixed(2)}</p>
                {item.category && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                    {item.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="btn-primary"
                disabled={!item.isAvailable}
              >
                {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
