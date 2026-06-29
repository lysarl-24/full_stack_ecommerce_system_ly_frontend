<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Welcome to Our Store</h1>
        <p>Discover amazing products at unbeatable prices</p>
        <router-link to="/products" class="hero-btn">
          Shop Now
        </router-link>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <div v-if="productStore.loading" class="loading-container">
          <LoadingSpinner message="Loading featured products..." />
        </div>
        <div v-else-if="featuredProducts.length > 0" class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
        <div v-else class="no-products">
          <p>No featured products available</p>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div v-if="productStore.loading" class="loading-container">
          <LoadingSpinner message="Loading categories..." />
        </div>
        <div v-else-if="productStore.categories.length > 0" class="categories-grid">
          <div 
            v-for="category in productStore.categories" 
            :key="category.id"
            class="category-card"
            @click="goToCategory(category.id)"
          >
            <div class="category-icon">
              {{ category.icon || '📦' }}
            </div>
            <h3>{{ category.name }}</h3>
            <p v-if="category.product_count">
              {{ category.product_count }} products
            </p>
          </div>
        </div>
        <div v-else class="no-categories">
          <p>No categories available</p>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Latest Products</h2>
        <div v-if="productStore.loading" class="loading-container">
          <LoadingSpinner message="Loading latest products..." />
        </div>
        <div v-else-if="latestProducts.length > 0" class="products-grid">
          <ProductCard 
            v-for="product in latestProducts" 
            :key="product.id" 
            :product="product"
          />
        </div>
        <div v-else class="no-products">
          <p>No products available</p>
        </div>
        <div class="view-all">
          <router-link to="/products" class="view-all-btn">
            View All Products
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import ProductCard from '../components/products/ProductCard.vue';

const router = useRouter();
const productStore = useProductStore();

// Get featured products (first 4)
const featuredProducts = computed(() => {
  return productStore.products.slice(0, 4);
});

// Get latest products (next 4 after featured)
const latestProducts = computed(() => {
  return productStore.products.slice(4, 8);
});

function goToCategory(categoryId) {
  router.push({ 
    name: 'products', 
    query: { category: categoryId } 
  });
}

onMounted(async () => {
  try {
    // Fetch products and categories
    await Promise.all([
      productStore.fetchProducts(),
      productStore.fetchCategories(),
    ]);
  } catch (error) {
    console.error('Failed to load home page data:', error);
  }
});
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 1rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin: 0 0 1rem;
  font-weight: bold;
}

.hero p {
  font-size: 1.3rem;
  margin: 0 0 2rem;
  opacity: 0.9;
}

.hero-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background-color: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Sections */
.section {
  padding: 4rem 1rem;
}

.section:nth-child(even) {
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 2rem;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

/* Categories Section */
.categories-section {
  background-color: #f8f9fa;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
  font-size: 1.2rem;
}

.category-card p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.no-categories {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
}

/* View All Button */
.view-all {
  text-align: center;
  margin-top: 2rem;
}

.view-all-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.view-all-btn:hover {
  background-color: #2980b9;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>