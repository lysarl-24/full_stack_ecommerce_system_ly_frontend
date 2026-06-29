import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useOrderStore = defineStore('orders', () => {
  // State
  const orders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const orderCount = computed(() => orders.value.length);

  // Actions
  async function fetchOrders() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/orders');
      orders.value = response.data.data || [];
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch orders';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrder(id) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/orders/${id}`);
      currentOrder.value = response.data.data || response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch order';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function checkout(cartItems, shippingAddress, paymentMethod) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/checkout', {
        items: cartItems,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });
      // Clear cart after successful checkout
      const cartStore = useCartStore();
      await cartStore.clearCart();
      // Refresh orders
      await fetchOrders();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Checkout failed';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    orderCount,
    fetchOrders,
    fetchOrder,
    checkout,
  };
});