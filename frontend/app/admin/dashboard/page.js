'use client';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../../context/AuthContext';
import api from '../../../lib/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Form State
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '', description: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    const prodRes = await api.get('/products');
    const orderRes = await api.get('/orders', config);
    setProducts(prodRes.data);
    setOrders(orderRes.data);
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('image', imageFile);
    // Upload to ImgBB
    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, formData);
    return res.data.data.url;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await api.post('/products', { ...newItem, image: imageUrl }, config);
      toast.success('Product Added');
      fetchData();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if(!confirm('Are you sure?')) return;
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    await api.delete(`/products/${id}`, config);
    fetchData();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Management */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <form onSubmit={handleAddProduct} className="space-y-3 border p-4 rounded bg-gray-50">
          <input placeholder="Name" className="w-full p-2 border" onChange={e => setNewItem({...newItem, name: e.target.value})} />
          <input placeholder="Price" type="number" className="w-full p-2 border" onChange={e => setNewItem({...newItem, price: e.target.value})} />
          <input placeholder="Category" className="w-full p-2 border" onChange={e => setNewItem({...newItem, category: e.target.value})} />
          <textarea placeholder="Description" className="w-full p-2 border" onChange={e => setNewItem({...newItem, description: e.target.value})} />
          <input placeholder="Stock" type="number" className="w-full p-2 border" onChange={e => setNewItem({...newItem, stock: e.target.value})} />
          <input type="file" onChange={e => setImageFile(e.target.files[0])} />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Add Product</button>
        </form>

        <h3 className="text-xl font-bold mt-6">Existing Products</h3>
        <ul>
          {products.map(p => (
            <li key={p._id} className="flex justify-between border-b p-2">
              {p.name} (${p.price})
              <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Management */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        {orders.map(order => (
          <div key={order._id} className="border p-3 mb-3 rounded">
            <p><strong>ID:</strong> {order._id}</p>
            <p><strong>User:</strong> {order.user?.name}</p>
            <p><strong>Total:</strong> ${order.totalPrice}</p>
            <p><strong>Status:</strong> {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
