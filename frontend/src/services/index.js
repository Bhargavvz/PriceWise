import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateLocation: async (latitude, longitude) => {
    const response = await api.put('/auth/location', { latitude, longitude });
    return response.data;
  }
};

export const productService = {
  search: async (params) => {
    const response = await api.get('/products/search', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  }
};

export const priceService = {
  getProductPrices: async (productId) => {
    const response = await api.get(`/prices/product/${productId}`);
    return response.data;
  },

  getPriceHistory: async (productId, storeId, days = 30) => {
    const response = await api.get(`/prices/history/${productId}/${storeId}`, {
      params: { days }
    });
    return response.data;
  },

  comparePrices: async (productIds, latitude, longitude, radius = 10) => {
    const response = await api.post('/prices/compare', {
      product_ids: productIds,
      latitude,
      longitude,
      radius
    });
    return response.data;
  },

  getSaleItems: async (storeId = null, limit = 20) => {
    const response = await api.get('/prices/sales', {
      params: { store_id: storeId, limit }
    });
    return response.data;
  }
};

export const storeService = {
  getStores: async (limit = 50) => {
    const response = await api.get('/stores', { params: { limit } });
    return response.data;
  },

  getStore: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  getNearbyStores: async (latitude, longitude, radius = 10, limit = 20) => {
    const response = await api.get('/stores/nearby', {
      params: { latitude, longitude, radius, limit }
    });
    return response.data;
  },

  getStoresByChain: async (chainName) => {
    const response = await api.get(`/stores/chain/${chainName}`);
    return response.data;
  },

  getChains: async () => {
    const response = await api.get('/stores/chains');
    return response.data;
  }
};

export const listService = {
  createList: async (name, description = '') => {
    const response = await api.post('/lists', { name, description });
    return response.data;
  },

  getLists: async () => {
    const response = await api.get('/lists');
    return response.data;
  },

  getList: async (id) => {
    const response = await api.get(`/lists/${id}`);
    return response.data;
  },

  updateList: async (id, data) => {
    const response = await api.put(`/lists/${id}`, data);
    return response.data;
  },

  deleteList: async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
  },

  addItem: async (listId, productId, quantity = 1, notes = '') => {
    const response = await api.post(`/lists/${listId}/items`, {
      product_id: productId,
      quantity,
      notes
    });
    return response.data;
  },

  updateItem: async (itemId, data) => {
    const response = await api.put(`/lists/items/${itemId}`, data);
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/lists/items/${itemId}`);
    return response.data;
  },

  optimizeList: async (listId, latitude, longitude, radius = 10) => {
    const response = await api.post(`/lists/${listId}/optimize`, {
      latitude,
      longitude,
      radius
    });
    return response.data;
  }
};

export const analyticsService = {
  getSavings: async (days = 30) => {
    const response = await api.get('/analytics/savings', { params: { days } });
    return response.data;
  },

  getPriceTrends: async (productId = null, days = 30) => {
    const response = await api.get('/analytics/trends', {
      params: { product_id: productId, days }
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  getPopularProducts: async (latitude, longitude, limit = 10) => {
    const response = await api.get('/analytics/popular', {
      params: { latitude, longitude, limit }
    });
    return response.data;
  }
};
