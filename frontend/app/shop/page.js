'use client';
import { useState, useEffect, useContext } from 'react';
import api from '../../lib/api';
import CartContext from '../../context/CartContext';
import Image from 'next/image';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow hover:shadow-lg transition">
            <div className="relative w-full h-48 mb-4">
              <Image src={product.image} alt={product.name} fill className="object-cover rounded" />
            </div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <button 
              onClick={() => addToCart(product)}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
