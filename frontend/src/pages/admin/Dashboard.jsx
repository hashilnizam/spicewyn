import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
} from 'lucide-react';
import { adminGetDashboard } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminGetDashboard({ period: 'month' }),
  });

  const stats = data?.data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.revenue?.total || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Orders',
      value: stats?.revenue?.orderCount || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Customers',
      value: stats?.customers?.total || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Average Order',
      value: formatCurrency(stats?.revenue?.averageOrderValue || 0),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold">Stock Alerts</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Low Stock Items</span>
                <span className="font-bold text-yellow-600">{stats?.stockAlerts?.lowStock || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Out of Stock</span>
                <span className="font-bold text-red-600">{stats?.stockAlerts?.outOfStock || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Customer Stats</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Customers</span>
                <span className="font-bold">{stats?.customers?.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>New This Month</span>
                <span className="font-bold text-green-600">{stats?.customers?.new || 0}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3">Product</th>
                  <th className="text-right py-3">Sold</th>
                  <th className="text-right py-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats?.topProducts?.slice(0, 10).map((product) => (
                  <tr key={product._id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3">{product.totalSold}</td>
                    <td className="text-right py-3 font-semibold">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
