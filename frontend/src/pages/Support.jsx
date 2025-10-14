import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Headphones } from 'lucide-react';
import { createTicket } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Support = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'order',
    message: '',
  });

  const createTicketMutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success('Support ticket created successfully!');
      setFormData({ subject: '', category: 'order', message: '' });
    },
    onError: () => {
      toast.error('Failed to create ticket');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicketMutation.mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>Customer Support - SpiceWyn</title>
      </Helmet>

      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Headphones className="w-16 h-16 mx-auto mb-4 text-primary-600" />
            <h1 className="text-3xl font-display font-bold mb-2">Customer Support</h1>
            <p className="text-gray-600 dark:text-gray-400">We're here to help you</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Brief description of your issue"
              />

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                  required
                >
                  <option value="order">Order Related</option>
                  <option value="product">Product Question</option>
                  <option value="payment">Payment Issue</option>
                  <option value="shipping">Shipping & Delivery</option>
                  <option value="return">Return & Refund</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input w-full min-h-[150px]"
                  required
                  placeholder="Please provide details about your issue..."
                />
              </div>

              <Button type="submit" className="w-full" isLoading={createTicketMutation.isPending}>
                Submit Ticket
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
