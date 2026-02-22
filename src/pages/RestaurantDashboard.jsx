import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisineType: '',
    address: '',
    description: '',
    imageUrl: '',
    phoneNumber: '',
  });
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/restaurant-dashboard/${id}`);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
  };

  const handleAddRestaurant = async () => {
    try {
      await restaurantAPI.create(newRestaurant);
      fetchRestaurants();
      setNewRestaurant({ name: '', cuisineType: '', address: '', description: '', imageUrl: '', phoneNumber: '' });
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await restaurantAPI.delete(id);
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Manage Restaurants</h2>
      
      {/* Add New Restaurant */}
      <div className="bg-white shadow rounded p-6 mb-8 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Restaurant</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={newRestaurant.name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Cuisine Type"
            name="cuisineType"
            value={newRestaurant.cuisineType}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={newRestaurant.address}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={newRestaurant.phoneNumber}
            onChange={handleInputChange}
            className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newRestaurant.description}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="text"
          placeholder="Image URL"
          name="imageUrl"
          value={newRestaurant.imageUrl}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleAddRestaurant}
          className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
        >
          Add Restaurant
        </button>
      </div>

      {/* List of Restaurants */}
      <div className="grid md:grid-cols-2 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer flex flex-col"
            onClick={() => handleViewDetails(restaurant.id)}
          >
            {restaurant.imageUrl ? (
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-400 text-xl">
                No Image
              </div>
            )}

            {/* Info */}
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{restaurant.name}</h3>
            {restaurant.description && (
              <p className="text-gray-600 mb-2 line-clamp-2">{restaurant.description}</p>
            )}
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>{restaurant.cuisineType}</span>
              <span>{restaurant.address}</span>
            </div>
            {/* Delete Button inside card */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent view details
                handleDelete(restaurant.id);
              }}
              className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition self-start"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDashboard;