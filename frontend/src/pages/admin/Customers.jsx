import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { adminGetUsers } from '@/services/api';
import { formatDate } from '@/lib/utils';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Customers = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page],
    queryFn: () => adminGetUsers({ page, limit: 20, role: 'customer' }),
  });

  const customers = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  return (
    <>
      <Helmet>
        <title>Customers - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-display font-bold mb-6">Customers</h1>

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
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Contact</th>
                    <th className="text-center py-3 px-4">Loyalty Points</th>
                    <th className="text-center py-3 px-4">Joined</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-semibold">{customer.name}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{customer.email}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{customer.mobile}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">{customer.loyaltyPoints || 0}</td>
                      <td className="py-3 px-4 text-center">{formatDate(customer.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={customer.isActive ? 'success' : 'danger'}>
                          {customer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Customers;
