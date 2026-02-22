import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-green-600 mb-6">Fresh Groceries Delivered</h1>
      <p className="text-xl mb-8">Order fresh fruits, vegetables, and daily essentials.</p>
      <Link href="/shop" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg hover:bg-green-700 transition">
        Start Shopping
      </Link>
    </div>
  );
}
