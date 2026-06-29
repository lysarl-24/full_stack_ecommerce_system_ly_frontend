<template>
  <div class="cart-item">
    <div class="cart-item-image">
       <img 
       :src="getImageUrl(item.product?.image)" 
       :alt="item.product?.name"
       @error="onImageError">
    </div>

    <div class="cart-item-details">
      <h3 class="cart-item-name">
        <router-link :to="`/products/${item.product_id}`">
          {{ item.product?.name }}
        </router-link>
      </h3>
      <p class="cart-item-price">${{ formatPrice(item.product?.price) }}</p>
    </div>

    <div class="cart-item-quantity">
      <button 
        @click="decreaseQuantity" 
        :disabled="item.quantity <= 1 || cartStore.loading"
        class="qty-btn"
      >
        -
      </button>
      <span class="qty-value">{{ item.quantity }}</span>
      <button 
        @click="increaseQuantity" 
        :disabled="item.quantity >= item.product?.stock || cartStore.loading"
        class="qty-btn"
      >
        +
      </button>
    </div>

    <div class="cart-item-subtotal">
      ${{ formatPrice(item.price * item.quantity) }}
    </div>

    <button 
      @click="removeItem" 
      class="cart-item-remove"
      :disabled="cartStore.loading"
      title="Remove item"
    >
      🗑️
    </button>
  </div>
</template>

<script setup>
import { useCartStore } from '../../stores/cart';
import api from '../../api/axios'

function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  }
  if (imagePath.startsWith('http')) return imagePath;
  return `${api.defaults.baseURL.replace('/api', '')}/storage/${imagePath}`;
}

function onImageError(event) {
  event.target.src = 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
}

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const cartStore = useCartStore();

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

async function increaseQuantity() {
  if (props.item.quantity < props.item.product?.stock) {
    await cartStore.updateQuantity(props.item.id, props.item.quantity + 1);
  }
}

async function decreaseQuantity() {
  if (props.item.quantity > 1) {
    await cartStore.updateQuantity(props.item.id, props.item.quantity - 1);
  }
}

async function removeItem() {
  if (confirm('Are you sure you want to remove this item from cart?')) {
    await cartStore.removeItem(props.item.id);
  }
}
</script>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
}

.cart-item-name {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.cart-item-name a {
  color: #2c3e50;
  text-decoration: none;
}

.cart-item-name a:hover {
  color: #3498db;
}

.cart-item-price {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.qty-btn:hover:not(:disabled) {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-value {
  min-width: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.cart-item-subtotal {
  font-size: 1.2rem;
  font-weight: bold;
  color: #27ae60;
  min-width: 100px;
  text-align: right;
}

.cart-item-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: transform 0.3s;
}

.cart-item-remove:hover:not(:disabled) {
  transform: scale(1.2);
}

.cart-item-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }

  .cart-item-quantity,
  .cart-item-subtotal,
  .cart-item-remove {
    grid-column: span 2;
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
  }
}
</style>