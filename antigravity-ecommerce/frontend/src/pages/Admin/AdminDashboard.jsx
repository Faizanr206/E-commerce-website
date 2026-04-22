import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/products/admin/kpis');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20 text-center animate-pulse">Loading KPIs...</div>;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `PKR ${stats?.totalRevenue?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Low Stock Alerts',
      value: stats?.lowStockItems || 0,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Customers',
      value: stats?.customerGrowth?.reduce((acc, curr) => acc + curr.count, 0) || 0,
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="py-10">
      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Command Center</h1>
        <p className="text-muted text-lg font-medium">Monitoring the LittleLegends adventure fleet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2rem] border-glass-border relative overflow-hidden group hover:scale-[1.02] transition-all"
          >
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} w-fit mb-6 shadow-lg shadow-black/5`}>
              <stat.icon size={28} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-muted mb-1">{stat.label}</h3>
            <p className="text-3xl font-black">{stat.value}</p>
            
            {/* Background Glow */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${stat.bg.replace('/10', '/100')}`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2rem] border-glass-border">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
              <TrendingUp className="text-accent" />
              Customer Growth
            </h3>
            <span className="text-xs font-bold text-muted uppercase tracking-widest">Yearly Telemetry</span>
          </div>
          <div className="h-64 flex items-end gap-3 pb-4">
             {stats?.customerGrowth?.map((month, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.count / Math.max(...stats.customerGrowth.map(m => m.count))) * 100}%` }}
                    className="w-full bg-accent rounded-t-xl opacity-60 hover:opacity-100 transition-opacity cursor-pointer relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-bg border border-glass-border px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {month.count} Signups
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted">M{month._id}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-1 glass p-8 rounded-[2rem] border-glass-border flex flex-col">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Package className="text-accent" />
            Quick Actions
          </h3>
          <div className="flex flex-col gap-4 flex-1">
            <Link to="/admin/products" className="w-full py-5 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-accent/20 hover:opacity-90 active:scale-95 transition-all text-center">
              Manage Toy Legends
            </Link>
            <Link to="/admin/orders" className="w-full py-5 glass border-glass-border rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-muted/10 active:scale-95 transition-all text-center">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
