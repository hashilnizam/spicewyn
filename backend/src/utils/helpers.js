export const generatePagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const skip = (currentPage - 1) * itemsPerPage;

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: total,
    skip,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};

export const calculateDiscount = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};

export const calculateLoyaltyPoints = (orderTotal) => {
  // 1 point per ₹100 spent
  return Math.floor(orderTotal / 100);
};

export const applyDiscount = (subtotal, coupon) => {
  if (!coupon) return 0;
  
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.discountValue;
  }
  
  return Math.min(discount, subtotal);
};

export const generateSKU = (productName, categoryName) => {
  const namePart = productName.substring(0, 3).toUpperCase();
  const catPart = categoryName.substring(0, 2).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${catPart}-${namePart}-${randomPart}`;
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const generateStructuredData = (product) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images.map(img => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'SpiceWyn'
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.CLIENT_URL}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    },
    aggregateRating: product.ratings.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.ratings.average,
      reviewCount: product.ratings.count
    } : undefined
  };
};

export const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.otpCode;
  delete userObj.otpExpires;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  return userObj;
};
