<template>
  <div class="products-page">
    <div class="container">
      <h1 class="page-title">All Products</h1>

      <!-- Filters Section -->
      <div class="filters-section">
        <SearchBar 
          v-model="searchQuery" 
          @search="handleSearch"
          @clear="clearSearch"
        />

        <div class="filter-row">
          <div class="filter-group">
            <label for="category">Category:</label>
            <select 
              v-model="selectedCategory" 
              @change="applyFilters"
              class="filter-select"
            >
              <option value="">All Categories</option>
              <option 
                v-for="category in productStore.categories" 
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="price-min">Min Price:</label>
            <input 
              v-model.number="priceMin" 
              @input="applyFilters"
              type="number" 
              placeholder="0"
              class="filter-input"
              min="0"
            />
          </div>

          <div class="filter-group">
            <label for="price-max">Max Price:</label>
            <input 
              v-model.number="priceMax" 
              @input="applyFilters"
              type="number" 
              placeholder="1000"
              class="filter-input"
              min="0"
            />
          </div>

          <button @click="clearFilters" class="btn-clear-filters">
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-if="productStore.loading" class="loading-container">
        <LoadingSpinner message="Loading products..." />
      </div>

      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product"
        />
      </div>

      <div v-else class="no-products">
        <EmptyState
          icon="🔍"
          title="No Products Found"
          message="Try adjusting your filters or search terms"
          link="/products"
          linkText="View All Products"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          Previous
        </button>

        <span class="page-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import ProductCard from '../components/products/ProductCard.vue';
import SearchBar from '../components/common/SearchBar.vue';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

const searchQuery = ref('');
const selectedCategory = ref('');
const priceMin = ref(null);
const priceMax = ref(null);

// Get filtered products from store
const filteredProducts = computed(() => productStore.filteredProducts);
const currentPage = computed(() => productStore.currentPage);
const totalPages = computed(() => productStore.totalPages);

// Initialize filters from route query
onMounted(async () => {
  // Set filters from URL query params
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
  if (route.query.priceMin) {
    priceMin.value = parseFloat(route.query.priceMin);
  }
  if (route.query.priceMax) {
    priceMax.value = parseFloat(route.query.priceMax);
  }

  // Fetch products and categories
  try {
    await Promise.all([
      productStore.fetchProducts(),
      productStore.fetchCategories(),
    ]);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
});

// Watch for route changes
watch(() => route.query, (newQuery) => {
  if (newQuery.search !== undefined) {
    searchQuery.value = newQuery.search;
  }
  if (newQuery.category !== undefined) {
    selectedCategory.value = newQuery.category;
  }
}, { deep: true });

function handleSearch(query) {
  searchQuery.value = query;
  applyFilters();
}

function clearSearch() {
  searchQuery.value = '';
  applyFilters();
}

function applyFilters() {
  productStore.setFilters({
    search: searchQuery.value,
    category: selectedCategory.value,
    priceMin: priceMin.value,
    priceMax: priceMax.value,
  });
  
  // Update URL query params
  const query = {};
  if (searchQuery.value) query.search = searchQuery.value;
  if (selectedCategory.value) query.category = selectedCategory.value;
  if (priceMin.value) query.priceMin = priceMin.value;
  if (priceMax.value) query.priceMax = priceMax.value;
  
  router.push({ query });
}

function clearFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  priceMin.value = null;
  priceMax.value = null;
  productStore.clearFilters();
  router.push({ query: {} });
}

function goToPage(page) {
  productStore.currentPage = page;
  productStore.fetchProducts({ page });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 2rem;
  text-align: center;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.filter-row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
}

.filter-select,
.filter-input {
  padding: 0.6rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #3498db;
}

.btn-clear-filters {
  padding: 0.6rem 1.5rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  height: fit-content;
}

.btn-clear-filters:hover {
  background-color: #c0392b;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-products {
  text-align: center;
  padding: 3rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.page-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.page-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.page-info {
  color: #2c3e50;
  font-weight: bold;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .btn-clear-filters {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}
</style>