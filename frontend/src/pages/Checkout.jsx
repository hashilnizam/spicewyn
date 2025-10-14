import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { createOrder } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState({});

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (response) => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = 'Valid 10-digit mobile required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.match(/^[0-9]{6}$/)) newErrors.pincode = 'Valid 6-digit pincode required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        variant: item.variant,
      })),
      shippingAddress: {
        name: formData.name,
        mobile: formData.mobile,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      paymentMethod: formData.paymentMethod,
    };

    createOrderMutation.mutate(orderData);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label="Mobile Number *"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  error={errors.mobile}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <Input
                  label="Address Line 1 *"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  error={errors.addressLine1}
                />
                <Input
                  label="Address Line 2"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={errors.city}
                  />
                  <Input
                    label="State *"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    error={errors.state}
                  />
                  <Input
                    label="Pincode *"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={errors.pincode}
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold">Card Payment</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Credit/Debit card</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.variant}`} className="flex gap-3">
                    <img
                      src={item.product.images[0]?.url || '/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={createOrderMutation.isPending}
              >
                Place Order
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
