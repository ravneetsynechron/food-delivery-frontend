import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { restaurantAPI } from '../services/api';

const RestaurantDashboardItems = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddItem, setShowAddItem] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isAvailable: true,
    });

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

    const handleInputChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleAddNewItem = async () => {
        try {
            await restaurantAPI.addMenuItem(id, newItem);
            toast.success('New item added');
            fetchRestaurantDetails();
            setShowAddItem(false);
            setNewItem({ name: '', description: '', price: '', category: '', imageUrl: '', isAvailable: true });
        } catch (error) {
            console.error('Error adding menu item:', error);
            toast.error('Failed to add new item');
        }
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await restaurantAPI.deleteMenuItem(id, itemId); // Adjust if your API uses different params
            toast.success('Item deleted');
            fetchRestaurantDetails();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            toast.error('Failed to delete item');
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
            {/* Restaurant Info */}
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
                        <p className={""} mb-2>{restaurant.address}</p>
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

            {/* Button to toggle add item form */}
            <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                {showAddItem ? 'Cancel' : 'Add New Menu Item'}
            </button>

            {/* New item form */}
            {showAddItem && (
                <div className="mb-8 p-4 border rounded bg-gray-50 max-w-md">
                    <h3 className="text-xl mb-4">Add New Menu Item</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={newItem.name}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        value={newItem.description}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={newItem.price}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        name="category"
                        value={newItem.category}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        name="imageUrl"
                        value={newItem.imageUrl}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <div className="mb-2">
                        <label className="mr-2">
                            <input
                                type="checkbox"
                                checked={newItem.isAvailable}
                                onChange={(e) => setNewItem({ ...newItem, isAvailable: e.target.checked })}
                            />{' '}
                            Available
                        </label>
                    </div>
                    <button
                        onClick={handleAddNewItem}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save Item
                    </button>
                </div>
            )}

            {/* Menu Items */}
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            {menuItems.length === 0 ? (
                <p className="text-center text-gray-600">No menu items available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuItems.map((item) => (
                        <div key={item.id} className="card flex justify-between items-center border p-4 rounded">
                            <div>
                                {item.imageUrl && (
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mb-2 rounded" />
                                )}
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                <p className="font-bold">${item.price?.toFixed(2)}</p>
                                {item.category && (
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">{item.category}</span>
                                )}
                                {item.isAvailable ? (
                                    <p className="text-green-600 text-xs mt-2">Available</p>
                                ) : (
                                    <p className="text-red-600 text-xs mt-2">Unavailable</p>
                                )}
                            </div>
                            {/* Delete button */}
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantDashboardItems;