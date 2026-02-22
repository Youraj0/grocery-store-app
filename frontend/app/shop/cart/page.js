'use client';
import { useContext } from 'react';
import CartContext from '../../../context/CartContext';
import AuthContext from '../../../context/AuthContext';
import api from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Set headers manually since context might load late
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    
    try {
      await api.post('/orders', {
        orderItems: cart.map(item => ({...item, product: item._id})),
        shippingAddress: user.address || "Default Address",
        totalPrice: total
      }, config);
      
      clearCart();
      toast.success('Order placed successfully!');
      router.push('/shop');
    } catch (error) {
      toast.error('Order failed');
    }
  };

  if (cart.length === 0) return <p className="text-center text-2xl mt-10">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.map((item) => (
        <div key={item._id} className="flex justify-between items-center border-b py-4">
          <div className="flex items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded" />
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>${item.price} x {item.qty}</p>
            </div>
          </div>
          <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">Remove</button>
        </div>
      ))}
      <div className="mt-8 text-right">
        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
        <button onClick={handleCheckout} className="mt-4 bg-green-600 text-white px-8 py-3 rounded text-lg hover:bg-green-700">
          Checkout
        </button>
      </div>
    </div>
  );
}
