import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminGetProducts, adminDeleteProduct } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const Products = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => adminGetProducts({ page, limit: 20, search }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries(['admin-products']);
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const products = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Products - Admin - SpiceWyn</title>
      </Helmet>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">Products</h1>
          <Button>
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Products Table */}
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
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Price</th>
                    <th className="text-right py-3 px-4">Stock</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]?.url || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.category?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatCurrency(product.price)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={product.stock <= product.lowStockThreshold ? 'text-red-600' : ''}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={product.isActive ? 'success' : 'danger'}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
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

export default Products;
