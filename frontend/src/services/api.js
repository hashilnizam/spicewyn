import axios from '../lib/axios';

// Products
export const getProducts = (params) => axios.get('/products', { params });
export const getProductBySlug = (slug) => axios.get(`/products/${slug}`);
export const getRelatedProducts = (slug) => axios.get(`/products/${slug}/related`);

// Categories
export const getCategories = (params) => axios.get('/categories', { params });
export const getCategoryBySlug = (slug) => axios.get(`/categories/${slug}`);

// Orders
export const createOrder = (data) => axios.post('/orders', data);
export const getMyOrders = (params) => axios.get('/orders/my-orders', { params });
export const getOrderById = (id) => axios.get(`/orders/${id}`);
export const cancelOrder = (id, data) => axios.post(`/orders/${id}/cancel`, data);

// Coupons
export const validateCoupon = (data) => axios.post('/coupons/validate', data);

// Reviews
export const createReview = (data) => axios.post('/reviews', data);
export const getProductReviews = (productId, params) => axios.get(`/reviews/product/${productId}`, { params });

// Wishlist
export const getWishlist = () => axios.get('/wishlist');
export const addToWishlist = (productId) => axios.post(`/wishlist/${productId}`);
export const removeFromWishlist = (productId) => axios.delete(`/wishlist/${productId}`);

// Banners
export const getBanners = (params) => axios.get('/banners', { params });

// Support Tickets
export const createTicket = (data) => axios.post('/tickets', data);
export const getMyTickets = (params) => axios.get('/tickets/my-tickets', { params });
export const getTicketById = (id) => axios.get(`/tickets/${id}`);
export const addTicketReply = (id, data) => axios.post(`/tickets/${id}/reply`, data);

// Admin APIs
export const adminGetDashboard = (params) => axios.get('/admin/dashboard', { params });
export const adminGetProducts = (params) => axios.get('/products', { params });
export const adminCreateProduct = (data) => axios.post('/products', data);
export const adminUpdateProduct = (id, data) => axios.put(`/products/${id}`, data);
export const adminDeleteProduct = (id) => axios.delete(`/products/${id}`);
export const adminGetOrders = (params) => axios.get('/orders', { params });
export const adminUpdateOrderStatus = (id, data) => axios.put(`/orders/${id}/status`, data);
export const adminGetUsers = (params) => axios.get('/admin/users', { params });
export const adminUpdateUserStatus = (id, data) => axios.put(`/admin/users/${id}/status`, data);
export const adminUpdateUserRole = (id, data) => axios.put(`/admin/users/${id}/role`, data);
export const adminGetSettings = (params) => axios.get('/admin/settings', { params });
export const adminUpdateSettings = (data) => axios.put('/admin/settings', data);
export const adminCreateBackup = () => axios.post('/admin/backup');
export const adminGetBackupLogs = (params) => axios.get('/admin/backup/logs', { params });
export const adminSearchGlobal = (params) => axios.get('/admin/search', { params });
export const adminGetCategories = (params) => axios.get('/categories', { params });
export const adminCreateCategory = (data) => axios.post('/categories', data);
export const adminUpdateCategory = (id, data) => axios.put(`/categories/${id}`, data);
export const adminDeleteCategory = (id) => axios.delete(`/categories/${id}`);
export const adminGetCoupons = (params) => axios.get('/coupons', { params });
export const adminCreateCoupon = (data) => axios.post('/coupons', data);
export const adminUpdateCoupon = (id, data) => axios.put(`/coupons/${id}`, data);
export const adminDeleteCoupon = (id) => axios.delete(`/coupons/${id}`);
export const adminGetBanners = (params) => axios.get('/banners', { params });
export const adminCreateBanner = (data) => axios.post('/banners', data);
export const adminUpdateBanner = (id, data) => axios.put(`/banners/${id}`, data);
export const adminDeleteBanner = (id) => axios.delete(`/banners/${id}`);
export const adminGetTickets = (params) => axios.get('/tickets/all', { params });
export const adminUpdateTicket = (id, data) => axios.put(`/tickets/${id}`, data);
