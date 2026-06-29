<template>
  <div class="product-card">
    <div class="product-image">
      <img 
        :src="getImageUrl(product.image)" 
        :alt="product.name"
        @error="handleImageError"
      />
      <div class="product-actions">
        <button 
          @click="addToWishlist" 
          class="btn-wishlist"
          :class="{ active: isInWishlist }"
          :disabled="!authStore.isAuthenticated"
          title="Add to wishlist"
        >
          ♥
        </button>
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name">
        <router-link :to="`/products/${product.id}`">
          {{ product.name }}
        </router-link>
      </h3>

      <p class="product-category" v-if="product.category">
        {{ product.category.name }}
      </p>

      <p class="product-description">
        {{ truncateText(product.description, 80) }}
      </p>

      <div class="product-footer">
        <div class="product-price">
          ${{ formatPrice(product.price) }}
        </div>

        <div class="product-stock" :class="{ 'out-of-stock': product.stock === 0 }">
          {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
        </div>
      </div>

      <button 
        @click="addToCart" 
        class="btn-add-cart"
        :disabled="product.stock === 0 || cartStore.loading"
      >
        {{ cartStore.loading ? 'Adding...' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { useWishlistStore } from '../../stores/wishlist';
import api from '../../api/axios';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['added-to-cart']);

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const isInWishlist = computed(() => {
  return wishlistStore.items.some(
    item => item.product_id === props.product.id || item.id === props.product.id
  );
});

function getImageUrl(imagePath) {
  if (!imagePath) {
    // Return a data URI SVG placeholder
    return 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  }
  // If the path is already a full URL, return it as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the backend base URL
  return `${api.defaults.baseURL.replace('/api', '')}/storage/${imagePath}`;
}

function truncateText(text, length) {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function handleImageError(event) {
  // Handle broken images - set to data URI placeholder
  event.target.src = 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
}

async function addToCart() {
  try {
    await cartStore.addToCart(props.product.id, 1);
    emit('added-to-cart');
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert('Failed to add to cart. Please try again.');
  }
}

async function addToWishlist() {
  if (!authStore.isAuthenticated) {
    alert('Please login to add items to wishlist');
    return;
  }

  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(props.product.id);
    } else {
      await wishlistStore.addToWishlist(props.product.id);
    }
  } catch (error) {
    console.error('Failed to update wishlist:', error);
    alert('Failed to update wishlist. Please try again.');
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background-color: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.btn-wishlist {
  background: #e74d3c72;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-wishlist:hover:not(:disabled) {
  background: #e74c3c;
  color: white;
}

.btn-wishlist.active {
  background: #e74c3c;
  color: white;
}

.btn-wishlist:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-info {
  padding: 1rem;
}

.product-name {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
}

.product-name a {
  color: #2c3e50;
  text-decoration: none;
}

.product-name a:hover {
  color: #3498db;
}

.product-category {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin: 0 0 0.5rem;
}

.product-description {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 1rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #27ae60;
}

.product-stock {
  font-size: 0.85rem;
  color: #27ae60;
}

.product-stock.out-of-stock {
  color: #e74c3c;
}

.btn-add-cart {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-add-cart:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>