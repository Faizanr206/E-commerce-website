import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Package, Truck, Check, X, ChevronLeft, Loader2, DollarSign, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this adventure as completed?')) {
      try {
        await api.put(`/orders/${id}/deliver`);
        fetchOrders();
      } catch (err) {
        alert('Failed to update delivery status');
      }
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse font-black uppercase tracking-widest">Scanning Dispatch Log...</div>;

  return (
    <div className="py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/admin" className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-accent transition-colors">
            <ChevronLeft size={16} /> Command Center
          </Link>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Mission Control: Orders</h1>
          <p className="text-muted font-medium mt-1">Tracking toy adventures from factory to crib.</p>
        </div>
      </div>

      <div className="glass rounded-[2rem] border-glass-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-glass-border bg-muted/5">
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Mission ID</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Customer</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted text-center">Status</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Date</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted">Total</th>
                <th className="p-6 text-xs font-black uppercase tracking-widest text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-glass-border hover:bg-muted/5 transition-colors">
                  <td className="p-6">
                    <span className="font-black text-xs uppercase tracking-tighter opacity-50">#{order._id.slice(-8)}</span>
                  </td>
                  <td className="p-6 font-bold">{order.user?.name || 'Explorer'}</td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2 items-center">
                      <div className="flex gap-2">
                        {order.isPaid ? (
                           <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20 flex items-center gap-1">
                             <DollarSign size={10} /> Paid
                           </span>
                        ) : (
                           <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-1">
                             <X size={10} /> Pending
                           </span>
                        )}
                        {order.isDelivered ? (
                           <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center gap-1">
                             <Truck size={10} /> Landed
                           </span>
                        ) : (
                           <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/20 flex items-center gap-1">
                             <Package size={10} /> En Route
                           </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-sm font-medium">
                    <div className="flex items-center gap-2 text-muted">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-6 font-black text-accent">PKR {order.totalPrice.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {!order.isDelivered && order.isPaid && (
                        <button 
                          onClick={() => deliverHandler(order._id)}
                          className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <button 
                        className="p-2 text-muted hover:text-accent transition-colors"
                        title="View Details"
                      >
                        <Loader2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="p-20 text-center text-muted font-black uppercase tracking-widest opacity-50">
            No active missions in the logs.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
