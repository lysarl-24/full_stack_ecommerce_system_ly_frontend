<template>
  <div class="product-detail" v-if="productStore.currentProduct">
    <div class="container">
      <div class="product-detail-grid">
        <!-- Product Image -->
        <div class="product-image-section">
          <img 
            :src="getImageUrl(productStore.currentProduct.image)" 
            :alt="productStore.currentProduct.name"
            class="product-main-image"
            @error="handleImageError"
          />
        </div>

        <!-- Product Info -->
        <div class="product-info-section">
          <h1 class="product-name">{{ productStore.currentProduct.name }}</h1>

          <div class="product-meta">
            <span class="product-category" v-if="productStore.currentProduct.category">
              {{ productStore.currentProduct.category.name }}
            </span>
            <span class="product-price">
              ${{ formatPrice(productStore.currentProduct.price) }}
            </span>
          </div>

          <p class="product-description">
            {{ productStore.currentProduct.description }}
          </p>

          <div class="product-stock">
            <span :class="{ 'out-of-stock': productStore.currentProduct.stock === 0 }">
              {{ productStore.currentProduct.stock > 0 
                ? `${productStore.currentProduct.stock} in stock` 
                : 'Out of stock' }}
            </span>
          </div>

          <div class="product-actions">
            <button 
              @click="addToCart" 
              class="btn-add-cart"
              :disabled="productStore.currentProduct.stock === 0 || cartStore.loading"
            >
              {{ cartStore.loading ? 'Adding...' : 'Add to Cart' }}
            </button>

            <button 
              @click="toggleWishlist" 
              class="btn-wishlist"
              :class="{ active: isInWishlist }"
              :disabled="!authStore.isAuthenticated"
            >
              {{ isInWishlist ? '♥ Remove from Wishlist' : '♡ Add to Wishlist' }}
            </button>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <ReviewList :reviews="productStore.reviews" />

        <ReviewForm 
          v-if="authStore.isAuthenticated"
          :product-id="productId" 
        />
        <div v-else class="login-prompt">
          <p>Please <router-link to="/login">login</router-link> to write a review.</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="productStore.loading" class="loading-container">
    <LoadingSpinner message="Loading product details..." />
  </div>

  <div v-else class="not-found">
    <EmptyState
      icon="😕"
      title="Product Not Found"
      message="The product you're looking for doesn't exist or has been removed."
      link="/products"
      linkText="Browse Products"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useWishlistStore } from '../stores/wishlist';
import api from '../api/axios';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import ReviewList from '../components/reviews/ReviewList.vue';
import ReviewForm from '../components/reviews/ReviewForm.vue';

const route = useRoute();
const authStore = useAuthStore();
const productStore = useProductStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const productId = route.params.id;
const error = ref('');

const isInWishlist = computed(() => {
  return wishlistStore.items.some(
    item => item.product_id === parseInt(productId) || item.id === parseInt(productId)
  );
});

function getImageUrl(imagePath) {
  if (!imagePath) {
    return 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
  }
  if (imagePath.startsWith('http')) return imagePath;
  return `${api.defaults.baseURL.replace('/api', '')}/storage/${imagePath}`;
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function handleImageError(event) {
  event.target.src = 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23f8f9fa"/%3E%3Ctext x="150" y="100" font-family="Arial" font-size="16" fill="%237f8c8d" text-anchor="middle"%3EImage Not Found%3C/text%3E%3C/svg%3E';
}

async function addToCart() {
  try {
    await cartStore.addToCart(productStore.currentProduct.id, 1);
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to add to cart';
  }
}

async function toggleWishlist() {
  if (!authStore.isAuthenticated) {
    alert('Please login to manage wishlist');
    return;
  }

  try {
    if (isInWishlist.value) {
      await wishlistStore.removeFromWishlist(productId);
    } else {
      await wishlistStore.addToWishlist(productId);
    }
    error.value = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update wishlist';
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchProduct(productId),
      productStore.fetchReviews(productId),
    ]);
    if (authStore.isAuthenticated) {
      await wishlistStore.fetchWishlist();
    }
  } catch (err) {
    console.error('Failed to load product:', err);
  }
});
</script>

<style scoped>
.product-detail {
  padding: 2rem 0;
  min-height: 100vh;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.product-image-section {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.product-main-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.product-name {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0;
}

.product-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.product-category {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.product-price {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
}

.product-description {
  color: #555;
  line-height: 1.8;
  font-size: 1.05rem;
  margin: 0;
}

.product-stock {
  font-size: 1rem;
  font-weight: bold;
}

.product-stock span {
  color: #27ae60;
}

.product-stock span.out-of-stock {
  color: #e74c3c;
}

.product-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-add-cart {
  flex: 1;
  min-width: 200px;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-add-cart:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-add-cart:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.btn-wishlist {
  flex: 1;
  min-width: 200px;
  padding: 1rem 2rem;
  background-color: white;
  color: #e74c3c;
  border: 2px solid #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.btn-wishlist:hover:not(:disabled) {
  background-color: #e74c3c;
  color: white;
}

.btn-wishlist.active {
  background-color: #e74c3c;
  color: white;
}

.btn-wishlist:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c0392b;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #c0392b;
}

/* Reviews Section */
.reviews-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.login-prompt {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  margin-top: 2rem;
}

.login-prompt a {
  color: #3498db;
  font-weight: bold;
}

.login-prompt a:hover {
  text-decoration: underline;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.not-found {
  padding: 4rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .product-image-section {
    position: static;
  }

  .product-name {
    font-size: 1.8rem;
  }

  .product-price {
    font-size: 1.5rem;
  }

  .product-actions {
    flex-direction: column;
  }

  .btn-add-cart,
  .btn-wishlist {
    min-width: 100%;
  }
}
</style>