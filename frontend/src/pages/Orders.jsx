import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package } from 'lucide-react';
import { getMyOrders } from '@/services/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Orders = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => getMyOrders(),
  });

  const orders = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>My Orders - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-24 h-24 mx-auto mb-6 text-gray-400" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="card p-6 hover:shadow-lg transition-shadow block"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(order.orderStatus)}>
                      {order.orderStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(order.paymentStatus)}>
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold text-primary-600">{formatCurrency(order.total)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
