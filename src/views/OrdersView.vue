<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">My Orders</h1>

      <div v-if="orderStore.loading" class="loading-container">
        <LoadingSpinner message="Loading orders..." />
      </div>

      <div v-else-if="orderStore.orders.length > 0">
        <div class="orders-filter">
          <select class="filter-select" v-model="statusFilter">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button class="filter-btn" @click="applyFilter">Filter</button>
        </div>

        <div class="orders-table-container">
          <table class="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>John Doe</td>
              <td>${{ formatPrice(order.total_amount) }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(order.status)">
                  {{ formatStatus(order.status) }}
                </span>
              </td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <button @click="viewOrderDetails(order.id)" class="btn-view">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div v-else class="empty-orders">
        <EmptyState
          icon="📦"
          title="No orders yet"
          message="You haven't placed any orders. Start shopping now!"
          link="/products"
          linkText="Browse Products"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orders';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import api from '../api/axios';

const router = useRouter();
const orderStore = useOrderStore();

const statusFilter = ref('all');
const filteredOrders = ref([]);

function formatPrice(price) {
  return parseFloat(price).toFixed(2);
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatStatus(status) {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  const classMap = {
    pending: 'status-pending',
    processing: 'status-processing',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
  };
  return classMap[status] || '';
}

function viewOrderDetails(orderId) {
  router.push(`/orders/${orderId}`);
}

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

function applyFilter() {
  if (statusFilter.value === 'all') {
    filteredOrders.value = orderStore.orders;
  } else {
    filteredOrders.value = orderStore.orders.filter(order => order.status === statusFilter.value);
  }
}

onMounted(() => {
  orderStore.fetchOrders().then(() => {
    filteredOrders.value = orderStore.orders;
  });
});
</script>

<style scoped>
.orders-page {
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

.orders-table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table thead {
  background-color: #f8f9fa;
}

.orders-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 2px solid #e9ecef;
}

.orders-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  color: #555;
}

.orders-table tbody tr:hover {
  background-color: #f8f9fa;
}

.orders-table tbody tr:last-child td {
  border-bottom: none;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-shipped {
  background-color: #d4edda;
  color: #155724;
}

.status-delivered {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-view {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.btn-view:hover {
  background-color: #2980b9;
}

.orders-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.6rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #3498db;
}

.filter-btn {
  padding: 0.6rem 1.5rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.filter-btn:hover {
  background-color: #5a6268;
}

.empty-orders {
  padding: 2rem 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-view-details {
    width: 100%;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }
}
</style>