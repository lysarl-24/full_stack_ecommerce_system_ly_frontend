import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useWishlistStore = defineStore('wishlist', () => {
  // State
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const wishlistCount = computed(() => items.value.length);

  // Actions
  async function fetchWishlist() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/wishlist');
      items.value = response.data.data || [];
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch wishlist';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function addToWishlist(productId) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(`/wishlist/${productId}`);
      // Refresh wishlist
      await fetchWishlist();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add to wishlist';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function removeFromWishlist(productId) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      // Refresh wishlist
      await fetchWishlist();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove from wishlist';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function isInWishlist(productId) {
    return items.value.some(item => item.product_id === productId || item.id === productId);
  }

  return {
    items,
    loading,
    error,
    wishlistCount,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
});