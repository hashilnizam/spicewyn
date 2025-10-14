import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getProducts, getBanners } from '@/services/api';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

const Home = () => {
  const { data: bannersData } = useQuery({
    queryKey: ['banners', 'home_hero'],
    queryFn: () => getBanners({ placement: 'home_hero', isActive: true }),
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts({ isFeatured: true, limit: 8 }),
  });

  const { data: bestsellersData } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => getProducts({ isBestseller: true, limit: 8 }),
  });

  const { data: newArrivalsData } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => getProducts({ isNewArrival: true, limit: 8 }),
  });

  const banners = bannersData?.data?.data || [];
  const featured = featuredData?.data?.data || [];
  const bestsellers = bestsellersData?.data?.data || [];
  const newArrivals = newArrivalsData?.data?.data || [];

  return (
    <>
      <Helmet>
        <title>SpiceWyn - Premium Spices Direct from Farms</title>
        <meta name="description" content="Shop authentic, farm-fresh spices online at SpiceWyn. Premium quality whole spices, ground spices, and spice blends delivered to your doorstep." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {banners.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={banners[0].image.desktop}
              alt={banners[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="container-custom">
                <div className="max-w-2xl text-white">
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-in">
                    {banners[0].title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 animate-slide-up">
                    {banners[0].subtitle}
                  </p>
                  <Link to={banners[0].link?.url || '/products'}>
                    <Button size="lg" className="animate-scale-in">
                      {banners[0].link?.text || 'Shop Now'} <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full gradient-primary flex items-center">
            <div className="container-custom text-white">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                Premium Spices Direct from Farms
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Authentic • Fresh • Delivered to Your Doorstep
              </p>
              <Link to="/products">
                <Button size="lg" variant="secondary">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sourced directly from farms for authentic taste and aroma
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Best Prices</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Direct sourcing means better prices for you
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fresh Guarantee</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Always fresh, never old stock
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        subtitle="Hand-picked selection of our finest spices"
        products={featured}
        isLoading={featuredLoading}
        viewAllLink="/products?isFeatured=true"
      />

      {/* Bestsellers */}
      <ProductSection
        title="Bestsellers"
        subtitle="Customer favorites that keep selling out"
        products={bestsellers}
        viewAllLink="/products?isBestseller=true"
        bgClass="bg-gray-50 dark:bg-gray-800"
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Latest additions to our spice collection"
        products={newArrivals}
        viewAllLink="/products?isNewArrival=true"
      />

      {/* CTA Section */}
      <section className="py-16 gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Transform Your Cooking?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust SpiceWyn for authentic spices
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary">
              Explore All Products <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
};

const ProductSection = ({ title, subtitle, products, isLoading, viewAllLink, bgClass = '' }) => {
  if (isLoading) {
    return (
      <section className={`py-16 ${bgClass}`}>
        <div className="container-custom">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className={`py-16 ${bgClass}`}>
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
          {viewAllLink && (
            <Link to={viewAllLink} className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
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

export default Home;
