import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="text-6xl mb-6">😕</div>
      <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-2">Your payment was not completed.</p>
      {orderId && (
        <p className="text-gray-500 mb-8">Order #{orderId} is still pending.</p>
      )}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => navigate('/cart')}
          className="btn-primary"
        >
          Return to Cart
        </button>
        <button
          onClick={() => navigate('/restaurants')}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Browse Restaurants
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
