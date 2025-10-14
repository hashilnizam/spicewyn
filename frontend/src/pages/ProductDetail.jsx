import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, ShoppingCart, Heart, Share2, Package, Truck, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getProductBySlug, getRelatedProducts } from '@/services/api';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
  });

  const { data: relatedData } = useQuery({
    queryKey: ['related-products', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: !!slug,
  });

  const product = productData?.data?.data;
  const relatedProducts = relatedData?.data?.data || [];
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, isInWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - SpiceWyn</title>
        <meta name="description" content={product.shortDescription || product.description} />
      </Helmet>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="text-gray-600 hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]?.url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{product.ratings.average.toFixed(1)}</span>
                    <span className="text-gray-600">({product.ratings.count} reviews)</span>
                  </div>
                  <span className="text-gray-600">SKU: {product.sku}</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                  <Badge variant="danger">{discount}% OFF</Badge>
                </>
              )}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <Badge variant="success">In Stock ({product.stock} available)</Badge>
              ) : (
                <Badge variant="danger">Out of Stock</Badge>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-primary-600' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span className="text-sm">Premium Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary-600" />
                <span className="text-sm">Free Shipping ₹500+</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="text-sm">100% Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="card p-6 mb-12">
          <h2 className="text-2xl font-bold mb-4">Product Details</h2>
          <div className="space-y-4">
            {product.origin && (
              <div className="flex">
                <span className="w-32 font-semibold">Origin:</span>
                <span>{product.origin}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex">
                <span className="w-32 font-semibold">Weight:</span>
                <span>{product.weight}</span>
              </div>
            )}
            {product.shelfLife && (
              <div className="flex">
                <span className="w-32 font-semibold">Shelf Life:</span>
                <span>{product.shelfLife}</span>
              </div>
            )}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="flex">
                <span className="w-32 font-semibold">Ingredients:</span>
                <span>{product.ingredients.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
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
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
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

export default ProductDetail;
