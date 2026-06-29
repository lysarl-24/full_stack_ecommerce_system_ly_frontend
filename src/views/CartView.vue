<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Shopping Cart</h1>

      <div v-if="cartStore.loading && cartStore.items.length === 0" class="loading-container">
        <LoadingSpinner message="Loading cart..." />
      </div>

      <div v-else-if="cartStore.items.length > 0" class="cart-content">
        <div class="cart-items">
          <CartItemRow 
            v-for="item in cartStore.items" 
            :key="item.id" 
            :item="item" 
          />
        </div>

        <div class="cart-summary">
          <h2 class="summary-title">Order Summary</h2>
          
          <div class="summary-row">
            <span>Subtotal ({{ cartStore.cartCount }} items)</span>
            <span class="summary-value">${{ formatPrice(cartStore.cartTotal) }}</span>
          </div>

          <div class="summary-row">
            <span>Shipping</span>
            <span class="summary-value">Free</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span class="summary-value">${{ formatPrice(cartStore.cartTotal) }}</span>
          </div>

          <router-link to="/checkout" class="btn-checkout">
            Proceed to Checkout
          </router-link>

          <router-link to="/products" class="btn-continue">
            Continue Shopping
          </router-link>
        </div>
      </div>

      <div v-else class="empty-cart">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Looks like you haven't added any products to your cart yet."
          link="/products"
          linkText="Start Shopping"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import CartItemRow from '../components/cart/CartItemRow.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';

const cartStore = useCartStore();

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

onMounted(() => {
  cartStore.fetchCart();
});
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 2rem;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-summary {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 100px;
}

.summary-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #555;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  margin-top: 1rem;
}

.summary-value {
  font-weight: bold;
}

.btn-checkout {
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #27ae60;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: background-color 0.3s;
}

.btn-checkout:hover {
  background-color: #229954;
}

.btn-continue {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #3498db;
  text-decoration: none;
  border: 2px solid #3498db;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  margin-top: 1rem;
  transition: all 0.3s;
}

.btn-continue:hover {
  background-color: #3498db;
  color: white;
}

.empty-cart {
  padding: 2rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
  }
}
</style>