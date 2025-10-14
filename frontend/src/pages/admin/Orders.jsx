import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminGetOrders } from '@/services/api';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Orders = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, status],
    queryFn: () => adminGetOrders({ page, limit: 20, status }),
  });

  const orders = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return (
    <>
      <Helmet>
        <title>Orders - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold mb-6">Orders</h1>

        {/* Filters */}
        <div className="mb-6">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4">Order #</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-right py-3 px-4">Total</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-semibold">{order.orderNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{order.user?.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(order.orderStatus)}>
                          {order.orderStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge className={getStatusColor(order.paymentStatus)}>
                          {order.paymentStatus.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    page === pageNum
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
