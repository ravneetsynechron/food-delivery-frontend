import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { paymentAPI, orderAPI } from '../services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  const orderId = searchParams.get('orderId');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (orderId && sessionId) {
      verifyAndConfirm();
    } else {
      setStatus('error');
    }
  }, [orderId, sessionId]);

  const verifyAndConfirm = async () => {
    try {
      // Step 1: Verify payment with payment service
      const verifyRes = await paymentAPI.verify(sessionId);

      if (verifyRes.data.status === 'COMPLETED') {
        // Step 2: Confirm order (triggers delivery assignment)
        await orderAPI.confirm(orderId);
        setStatus('success');
        toast.success('Payment successful! Your order is confirmed.');
      } else {
        setStatus('error');
        toast.error('Payment verification failed.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      // Even if verify call fails, try to confirm (simulation mode)
      try {
        await orderAPI.confirm(orderId);
        setStatus('success');
        toast.success('Order confirmed!');
      } catch (confirmError) {
        setStatus('error');
        toast.error('Failed to confirm order.');
      }
    }
  };

  if (status === 'verifying') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold mb-4">Verifying Payment...</h1>
        <p className="text-gray-600">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-2xl font-bold mb-4">Payment Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          We couldn't verify your payment. Please contact support.
        </p>
        <button
          onClick={() => navigate('/orders')}
          className="btn-primary"
        >
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-2">Your order has been confirmed.</p>
      <p className="text-gray-500 mb-8">Order #{orderId}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate(`/orders/${orderId}`)}
          className="btn-primary"
        >
          Track Order
        </button>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
