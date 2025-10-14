import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { adminGetCategories } from '@/services/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Categories = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminGetCategories(),
  });

  const categories = data?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>Categories - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">Categories</h1>
          <Button>
            <Plus className="w-5 h-5" />
            Add Category
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
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Slug</th>
                    <th className="text-center py-3 px-4">Order</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4 font-semibold">{category.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{category.slug}</td>
                      <td className="py-3 px-4 text-center">{category.order}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={category.isActive ? 'success' : 'danger'}>
                          {category.isActive ? 'Active' : 'Inactive'}
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

export default Categories;
