import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { adminGetCoupons } from '@/services/api';
import { formatDate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Coupons = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => adminGetCoupons(),
  });

  const coupons = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Coupons - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">Coupons</h1>
          <Button>
            <Plus className="w-5 h-5" />
            Add Coupon
          </Button>
        </div>

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
                    <th className="text-left py-3 px-4">Code</th>
                    <th className="text-left py-3 px-4">Discount</th>
                    <th className="text-center py-3 px-4">Usage</th>
                    <th className="text-center py-3 px-4">Expiry</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-semibold">{coupon.code}</td>
                      <td className="py-3 px-4">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                      </td>
                      <td className="py-3 px-4 text-center">{formatDate(coupon.expiryDate)}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={coupon.isActive ? 'success' : 'danger'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
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

export default Coupons;
