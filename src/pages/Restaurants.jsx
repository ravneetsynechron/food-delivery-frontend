import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
 
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
 
  useEffect(() => {
    fetchRestaurants();
  }, []);
 
  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchRestaurants();
      return;
    }
 
    try {
      const response = await restaurantAPI.search(searchQuery);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error searching restaurants:', error);
    }
  };
 
  if (loading) {
    return <div className="text-center py-10">Loading restaurants...</div>;
  }
 
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Restaurants</h1>
 
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>
 
      {restaurants.length === 0 ? (
        <p className="text-center text-gray-600">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-6xl">🍽️</span>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-2">{restaurant.cuisineType}</p>
              <p className="text-sm text-gray-500">{restaurant.address}</p>
              <div className="mt-4 flex items-center">
                <span className="text-yellow-500">⭐</span>
                <span className="ml-1">{restaurant.rating?.toFixed(1) || 'New'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default Restaurants;
 
 