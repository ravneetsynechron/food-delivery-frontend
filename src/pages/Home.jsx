import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center">
      <div className="py-20">
        <h1 className="text-5xl font-bold mb-6">
          Delicious Food, <span className="text-primary">Delivered</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Order from your favorite restaurants and get food delivered to your doorstep in minutes.
        </p>
        <Link to="/restaurants" className="btn-primary text-lg px-8 py-3">
          Browse Restaurants
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="card">
          <div className="text-4xl mb-4">🍔</div>
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">
            Choose from hundreds of restaurants and thousands of dishes.
          </p>
        </div>
        <div className="card">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-gray-600">
            Get your food delivered hot and fresh in under 45 minutes.
          </p>
        </div>
        <div className="card">
          <div className="text-4xl mb-4">💳</div>
          <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">
            Pay securely with credit card, debit card, or digital wallet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
