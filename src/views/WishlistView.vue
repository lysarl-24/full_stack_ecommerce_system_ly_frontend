<template>
  <div class="wishlist-page">
    <div class="container">
      <h1 class="page-title">My Wishlist</h1>

      <div v-if="wishlistStore.loading" class="loading-container">
        <LoadingSpinner message="Loading wishlist..." />
      </div>

      <div v-else-if="wishlistStore.items.length > 0" class="wishlist-grid">
        <div v-for="item in wishlistStore.items" :key="item.id" class="wishlist-item">
          <!-- Product Image -->
          <div class="wishlist-item-image">
            <img 
            :src="getImageUrl(item.product?.image)" 
            :alt="item.product?.name" 
            @error="onImageError"/>
          </div>

          <div class="wishlist-item-details">
            <h3 class="wishlist-item-name">
              <router-link :to="`/products/${item.product_id}`">
                {{ item.product?.name }}
              </router-link>
            </h3>
            <p class="wishlist-item-price">${{ formatPrice(item.product?.price) }}</p>
            <p class="wishlist-item-stock" :class="{ 'out-of-stock': item.product?.stock === 0 }">
              {{ item.product?.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock' }}
            </p>
          </div>

          <div class="wishlist-item-actions">
            <button 
              @click="addToCart(item.product_id)" 
              class="btn-add-cart"
              :disabled="item.product?.stock === 0 || cartStore.loading"
            >
              {{ cartStore.loading ? 'Adding...' : 'Add to Cart' }}
            </button>

            <button 
              @click="removeFromWishlist(item.product_id)" 
              class="btn-remove"
              :disabled="wishlistStore.loading"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-wishlist">
        <EmptyState
          icon="💔"
          title="Your wishlist is empty"
          message="Start adding products you love to your wishlist!"
          link="/products"
          linkText="Browse Products"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWishlistStore } from '../stores/wishlist';
import { useCartStore } from '../stores/cart';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import api from '../api/axios'

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E'
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

async function addToCart(productId) {
  try {
    await cartStore.addToCart(productId, 1);
  } catch (error) {
    console.error('Failed to add to cart:', error);
    alert('Failed to add to cart. Please try again.');
  }
}

async function removeFromWishlist(productId) {
  try {
    await wishlistStore.removeFromWishlist(productId);
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    alert('Failed to remove from wishlist. Please try again.');
  }
}

onMounted(() => {
  wishlistStore.fetchWishlist();
});
</script>

<style scoped>
.wishlist-page {
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

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.wishlist-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wishlist-item-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
}

.wishlist-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wishlist-item-details {
  flex: 1;
}

.wishlist-item-name {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
}

.wishlist-item-name a {
  color: #2c3e50;
  text-decoration: none;
}

.wishlist-item-name a:hover {
  color: #3498db;
}

.wishlist-item-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #27ae60;
  margin: 0 0 0.5rem;
}

.wishlist-item-stock {
  font-size: 0.9rem;
  color: #27ae60;
  margin: 0;
}

.wishlist-item-stock.out-of-stock {
  color: #e74c3c;
}

.wishlist-item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.btn-remove {
  width: 100%;
  padding: 0.75rem;
  background-color: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-remove:hover:not(:disabled) {
  background-color: #e74c3c;
  color: white;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-wishlist {
  padding: 2rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>