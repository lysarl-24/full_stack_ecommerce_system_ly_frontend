import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useProductStore = defineStore('products', () => {
  // State
  const products = ref([]);
  const categories = ref([]);
  const currentProduct = ref(null);
  const reviews = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Filters
  const searchQuery = ref('');
  const selectedCategory = ref('');
  const priceMin = ref(null);
  const priceMax = ref(null);
  const currentPage = ref(1);
  const perPage = ref(12);
  const totalPages = ref(1);

  // Getters
  const filteredProducts = computed(() => {
    let result = products.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory.value) {
      result = result.filter(p => p.category_id === selectedCategory.value);
    }

    if (priceMin.value !== null) {
      result = result.filter(p => p.price >= priceMin.value);
    }

    if (priceMax.value !== null) {
      result = result.filter(p => p.price <= priceMax.value);
    }

    return result;
  });

  // Actions
  async function fetchProducts(params = {}) {
    loading.value = true;
    error.value = null;
    try {
      // Transform filter params to match backend expectations
      const apiParams = {
        ...params,
        category_id: params.category || params.category_id,
        min_price: params.priceMin || params.min_price,
        max_price: params.priceMax || params.max_price,
      };
      
      const response = await api.get('/products', { params: apiParams });
      products.value = response.data.data || [];
      if (response.data.pagination) {
        currentPage.value = response.data.pagination.current_page;
        totalPages.value = response.data.pagination.last_page;
      }
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch products';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProduct(id) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/products/${id}`);
      currentProduct.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch product';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.get('/categories');
      categories.value = response.data.data || [];
      return response.data;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  }

  async function searchProducts(query) {
    searchQuery.value = query;
    return fetchProducts({ q: query });
  }

  async function fetchReviews(productId) {
    try {
      const response = await api.get(`/products/${productId}/reviews`);
      reviews.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      return [];
    }
  }

  async function addReview(productId, reviewData) {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      // Refresh reviews
      await fetchReviews(productId);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to add review';
    }
  }

  function setFilters(filters) {
    if (filters.category) selectedCategory.value = filters.category;
    if (filters.priceMin !== undefined) priceMin.value = filters.priceMin;
    if (filters.priceMax !== undefined) priceMax.value = filters.priceMax;
    if (filters.search) searchQuery.value = filters.search;
  }

  function clearFilters() {
    searchQuery.value = '';
    selectedCategory.value = '';
    priceMin.value = null;
    priceMax.value = null;
    currentPage.value = 1;
  }

  return {
    products,
    categories,
    currentProduct,
    reviews,
    loading,
    error,
    searchQuery,
    selectedCategory,
    priceMin,
    priceMax,
    currentPage,
    perPage,
    totalPages,
    filteredProducts,
    fetchProducts,
    fetchProduct,
    fetchCategories,
    searchProducts,
    fetchReviews,
    addReview,
    setFilters,
    clearFilters,
  };
});