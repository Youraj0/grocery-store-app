'use client';
import Link from 'next/link';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">GroceryStore</Link>
        <div className="flex items-center space-x-6">
          <Link href="/shop" className="hover:text-green-200">Shop</Link>
          <Link href="/shop/cart" className="flex items-center hover:text-green-200">
            <FaShoppingCart className="mr-1" /> Cart ({cart.reduce((acc, item) => acc + item.qty, 0)})
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
               {user.role === 'admin' && <Link href="/admin/dashboard">Admin</Link>}
               <span className="font-semibold">Hi, {user.name}</span>
               <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center hover:text-green-200">
              <FaUser className="mr-1" /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
