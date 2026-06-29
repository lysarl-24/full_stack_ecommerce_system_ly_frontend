import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const cartCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Actions
  async function fetchCart() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/cart');
      items.value = response.data.data || [];
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch cart';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function addToCart(productId, quantity = 1) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/cart', {
        product_id: productId,
        quantity: quantity,
      });
      // Refresh cart
      await fetchCart();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to add to cart';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function updateQuantity(cartItemId, quantity) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put(`/cart/${cartItemId}`, { quantity });
      // Refresh cart
      await fetchCart();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update quantity';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function removeItem(cartItemId) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.delete(`/cart/${cartItemId}`);
      // Refresh cart
      await fetchCart();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to remove item';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function clearCart() {
    // Remove all items one by one
    const promises = items.value.map(item => removeItem(item.id));
    await Promise.all(promises);
    items.value = [];
  }

  return {
    items,
    loading,
    error,
    cartCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
});