import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getProducts, getCategories } from '@/services/api';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, category, search, minPrice, maxPrice, sort],
    queryFn: () => getProducts({
      page,
      limit: 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort,
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });

  const products = productsData?.data?.data || [];
  const pagination = productsData?.data?.pagination || {};
  const categories = categoriesData?.data?.data || [];

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Shop Premium Spices - SpiceWyn</title>
        <meta name="description" content="Browse our collection of premium spices, spice blends, and herbs. Authentic, fresh, and directly sourced from farms." />
      </Helmet>

      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-display font-bold">
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn btn-outline flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={`block w-full text-left px-3 py-2 rounded-lg ${
                      !category
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateFilter('category', cat._id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg ${
                        category === cat._id
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="input w-full"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-semibold mb-3">Sort By</h3>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="input w-full"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratings.average">Top Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  No products found
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => updateFilter('page', pageNum)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product }) => {
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  return (
    <Link to={`/products/${product.slug}`} className="card overflow-hidden group hover:shadow-xl transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={primaryImage?.url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.ratings.average.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">({product.ratings.count})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Products;
