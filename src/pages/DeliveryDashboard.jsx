import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { deliveryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('available');
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, [activeTab]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      if (activeTab === 'available') {
        const res = await deliveryAPI.getAvailable();
        setAvailableDeliveries(res.data);
      } else {
        const res = await deliveryAPI.getMyDeliveries();
        setMyDeliveries(res.data);
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await deliveryAPI.accept(deliveryId);
      toast.success('Delivery accepted');
      fetchDeliveries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      await deliveryAPI.updateStatus(deliveryId, status);
      toast.success('Status updated');
      fetchDeliveries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-yellow-100 text-yellow-800',
      IN_TRANSIT: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Delivery Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'available' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Available Deliveries
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'my' ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          My Deliveries
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          {activeTab === 'available' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                Available Deliveries ({availableDeliveries.length})
              </h2>
              {availableDeliveries.length === 0 ? (
                <p className="text-gray-600">No deliveries available at the moment</p>
              ) : (
                <div className="space-y-4">
                  {availableDeliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">Delivery #{delivery.id}</h3>
                          <p className="text-gray-600 text-sm">Order #{delivery.orderId}</p>
                          <p className="text-gray-500 text-sm mt-2">
                            <strong>Pickup:</strong> {delivery.pickupAddress}
                          </p>
                          <p className="text-gray-500 text-sm">
                            <strong>Deliver to:</strong> {delivery.deliveryAddress}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          className="btn-primary"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my' && (
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">
                My Deliveries ({myDeliveries.length})
              </h2>
              {myDeliveries.length === 0 ? (
                <p className="text-gray-600">No active deliveries</p>
              ) : (
                <div className="space-y-4">
                  {myDeliveries.map((delivery) => (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Delivery #{delivery.id}</h3>
                          <p className="text-gray-600 text-sm">Order #{delivery.orderId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(delivery.status)}`}>
                          {delivery.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-500 text-sm">
                          <strong>Pickup:</strong> {delivery.pickupAddress}
                        </p>
                        <p className="text-gray-500 text-sm">
                          <strong>Deliver to:</strong> {delivery.deliveryAddress}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {delivery.status === 'ASSIGNED' && (
                          <button
                            onClick={() => handleUpdateStatus(delivery.id, 'PICKED_UP')}
                            className="btn-primary text-sm"
                          >
                            Mark as Picked Up
                          </button>
                        )}
                        {delivery.status === 'PICKED_UP' && (
                          <button
                            onClick={() => handleUpdateStatus(delivery.id, 'IN_TRANSIT')}
                            className="btn-primary text-sm"
                          >
                            Start Delivery
                          </button>
                        )}
                        {delivery.status === 'IN_TRANSIT' && (
                          <button
                            onClick={() => handleUpdateStatus(delivery.id, 'DELIVERED')}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryDashboard;
