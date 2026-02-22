import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';
 
const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisineType: '',
    address: '',
    description: '',
    imageUrl: '',
    phoneNumber: '',
  });
 
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
    <div>
      <h2>Manage Restaurants</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={newRestaurant.name}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Cuisine Type"
          name="cuisineType"
          value={newRestaurant.cuisineType}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Address"
          name="address"
          value={newRestaurant.address}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newRestaurant.description}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          name="imageUrl"
          value={newRestaurant.imageUrl}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          name="phoneNumber"
          value={newRestaurant.phoneNumber}
          onChange={handleInputChange}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddRestaurant} className="bg-blue-500 text-white p-2 rounded">
          Add Restaurant
        </button>
      </div>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <strong>{restaurant.name}</strong>
              {restaurant.description && <p className="text-gray-600 text-sm">{restaurant.description}</p>}
            </div>
            <button onClick={() => handleDelete(restaurant.id)} className="bg-red-500 text-white p-1 rounded">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default AdminRestaurants;