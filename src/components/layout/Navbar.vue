<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        Online Store
      </router-link>

      <button class="nav-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/products" class="nav-link">Products</router-link>

        <!-- Wishlist -->
        <router-link to="/wishlist" class="nav-link" v-if="authStore.isAuthenticated">
          Wishlist
          <span v-if="wishlistStore.wishlistCount > 0" class="badge">
            {{ wishlistStore.wishlistCount }}
          </span>
        </router-link>

        <!-- Cart -->
        <router-link to="/cart" class="nav-link">
          Cart
          <span v-if="cartStore.cartCount > 0" class="badge">
            {{ cartStore.cartCount }}
          </span>
        </router-link>

        <!-- Authenticated user links -->
        <template v-if="authStore.isAuthenticated">
          <router-link to="/orders" class="nav-link">Orders</router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
          <button @click="handleLogout" class="nav-link btn-logout">Logout</button>
        </template>

        <!-- Guest links -->
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link btn-register">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { useWishlistStore } from '../../stores/wishlist';

const authStore = useAuthStore();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function handleLogout() {
  authStore.logout();
  cartStore.items = [];
  wishlistStore.items = [];
  window.location.href = '/';
}

// Load cart and wishlist on mount
onMounted(() => {
  if (authStore.isAuthenticated) {
    cartStore.fetchCart();
    wishlistStore.fetchWishlist();
  }
});
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-brand:hover {
  color: #3498db;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 3px 0;
  transition: 0.3s;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #3498db;
}

.badge {
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: bold;
}

.btn-logout {
  background-color: #e74c3c;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-logout:hover {
  background-color: #c0392b;
}

.btn-register {
  background-color: #27ae60;
}

.btn-register:hover {
  background-color: #229954;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #2c3e50;
    flex-direction: column;
    padding: 1rem;
    display: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .nav-menu.active {
    display: flex;
  }

  .nav-link {
    width: 100%;
    text-align: center;
  }
}
</style>