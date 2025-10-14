import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getOrderById } from '@/services/api';
import { formatCurrency, formatDateTime, getStatusColor } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const OrderDetail = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
  });

  const order = data?.data?.data;

  if (isLoading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{order.orderNumber} - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Order Details</h1>
            <p className="text-gray-600 dark:text-gray-400">Order #{order.orderNumber}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(item.total)}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="font-semibold">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="mt-2">Mobile: {order.shippingAddress.mobile}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-semibold">{order.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                  <span className="font-semibold">{formatDateTime(order.createdAt)}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tracking</span>
                    <span className="font-semibold">{order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {order.orderStatus === 'pending' && (
                <Button variant="danger" className="w-full mt-6">
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
