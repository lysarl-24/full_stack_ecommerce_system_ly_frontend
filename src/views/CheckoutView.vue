<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Checkout</h1>

      <div v-if="cartStore.items.length === 0" class="empty-cart">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          message="Add some products to your cart before checking out."
          link="/products"
          linkText="Browse Products"
        />
      </div>

      <div v-else class="checkout-content">
        <div class="checkout-form-section">
          <h2 class="section-title">Shipping Information</h2>

          <form @submit.prevent="handleCheckout" class="checkout-form">
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            <div v-if="success" class="success-message">
              Order placed successfully! Redirecting to orders page...
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="full_name">Full Name *</label>
                <input
                  v-model="form.full_name"
                  type="text"
                  id="full_name"
                  placeholder="John Doe"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="phone">Phone Number *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  placeholder="+1 234 567 8900"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="address">Address *</label>
              <input
                v-model="form.address"
                type="text"
                id="address"
                placeholder="123 Main Street"
                required
                class="form-input"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">City *</label>
                <input
                  v-model="form.city"
                  type="text"
                  id="city"
                  placeholder="New York"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="state">State/Province *</label>
                <input
                  v-model="form.state"
                  type="text"
                  id="state"
                  placeholder="NY"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="zip">ZIP Code *</label>
                <input
                  v-model="form.zip"
                  type="text"
                  id="zip"
                  placeholder="10001"
                  required
                  class="form-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="country">Country *</label>
              <input
                v-model="form.country"
                type="text"
                id="country"
                placeholder="United States"
                required
                class="form-input"
              />
            </div>


            <button 
              type="submit" 
              class="btn-place-order"
              :disabled="orderStore.loading"
            >
              {{ orderStore.loading ? 'Processing...' : `Place Order - $${ formatPrice(cartStore.cartTotal) }` }}
            </button>
          </form>
        </div>

        <div class="order-summary-section">
          <h2 class="section-title">Order Summary</h2>
          <div class="order-summary-card">
            <div class="summary-items">
              <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
                <div class="item-image">
                  <img :src="getItemImage(item)" :alt="item.product?.name" @error="onImageError" />
                </div>
                <div class="item-details">
                  <h4>{{ item.product?.name }}</h4>
                  <p>Qty: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  ${{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div class="summary-totals">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="total-row final">
                <span>Total</span>
                <span>${{ formatPrice(cartStore.cartTotal) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useOrderStore } from '../stores/orders';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import api from '../api/axios';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();

const error = ref('');
const success = ref(false);

  const form = reactive({
  full_name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: '',
});

function getItemImage(item) {
  const imagePath = item.product?.image;
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  }
  if (imagePath.startsWith('http')) return imagePath;
  return `${api.defaults.baseURL.replace('/api', '')}/storage/${imagePath}`;
}

function onImageError(event) {
  event.target.src = 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

async function handleCheckout() {
  error.value = '';

  // Basic validation
  if (!form.full_name || !form.phone || !form.address || !form.city || 
      !form.state || !form.zip || !form.country) {
    error.value = 'Please fill in all required fields';
    return;
  }

  try {
    const shippingAddress = `${form.full_name}, ${form.phone}, ${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`;

    await orderStore.checkout(
      cartStore.items,
      shippingAddress,
      'cash_on_delivery'
    );

    // Show success and redirect after delay
    success.value = true;
    error.value = '';
    setTimeout(() => {
      router.push('/orders');
    }, 1500);
  } catch (err) {
    success.value = false;
    error.value = err.response?.data?.message || 'Checkout failed. Please try again.';
  }
}
</script>

<style scoped>
.checkout-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 2rem;
  text-align: center;
}

.empty-cart {
  padding: 2rem 0;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.checkout-form-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #3498db;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background-color: #fee;
  color: #c0392b;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #c0392b;
  margin-bottom: 1rem;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #28a745;
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-input,
.form-select {
  padding: 0.85rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
}

.card-details {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-place-order {
  width: 100%;
  padding: 1.1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  margin-top: 1rem;
}

.btn-place-order:hover:not(:disabled) {
  background-color: #229954;
}

.btn-place-order:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.order-summary-section {
  position: sticky;
  top: 100px;
}

.order-summary-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-items {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.summary-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: #2c3e50;
}

.item-details p {
  margin: 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.item-price {
  font-weight: bold;
  color: #27ae60;
  font-size: 1rem;
}

.summary-totals {
  border-top: 2px solid #eee;
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #555;
}

.total-row.final {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
  padding-top: 0.75rem;
  border-top: 2px solid #eee;
  margin-top: 0.75rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary-section {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>