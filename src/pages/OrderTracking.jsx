import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderAPI, deliveryAPI } from '../services/api';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const orderRes = await orderAPI.getById(id);
      setOrder(orderRes.data);
      
      try {
        const deliveryRes = await deliveryAPI.getByOrder(id);
        setDelivery(deliveryRes.data);
      } catch (e) {
        // Delivery might not exist yet
      }
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderAPI.cancel(id);
      toast.success('Order cancelled');
      fetchOrderDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusStep = (status) => {
    const steps = ['CREATED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    return steps.indexOf(status);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!order) {
    return <div className="text-center py-10">Order not found</div>;
  }

  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm ${
              isCancelled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {order.status?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {!isCancelled && (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {['Created', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map((step, index) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}>
                    {index <= currentStep ? '✓' : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center">{step}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`flex-1 h-1 ${
                  i < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`} />
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Order Items</h3>
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <span>{item.menuItemName} x {item.quantity}</span>
              <span>${item.subtotal?.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">${order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {delivery && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Delivery Information</h3>
          <p><strong>Status:</strong> {delivery.status?.replace(/_/g, ' ')}</p>
          {delivery.agentName && (
            <p><strong>Delivery Agent:</strong> {delivery.agentName}</p>
          )}
          {delivery.estimatedDeliveryTime && (
            <p><strong>Estimated Delivery:</strong> {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</p>
          )}
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold mb-3">Delivery Address</h3>
        <p className="text-gray-600">{order.deliveryAddress}</p>
        {order.specialInstructions && (
          <>
            <h4 className="font-semibold mt-4 mb-2">Special Instructions</h4>
            <p className="text-gray-600">{order.specialInstructions}</p>
          </>
        )}
      </div>

      {!isCancelled && currentStep < 2 && (
        <button
          onClick={handleCancelOrder}
          className="mt-6 w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderTracking;
