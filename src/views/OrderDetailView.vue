<template>
  <div class="order-detail-page">
    <div class="container">
      <h1 class="page-title">Order #{{ orderStore.currentOrder?.id }}</h1>

      <div v-if="orderStore.loading" class="loading-container">
        <LoadingSpinner message="Loading order details..." />
      </div>

      <div v-else-if="orderStore.currentOrder" class="order-detail-content">
        <div class="order-info-card">
          <h2 class="section-title">Order Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Order ID:</span>
              <span class="info-value">#{{ orderStore.currentOrder.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date:</span>
              <span class="info-value">{{ formatDate(orderStore.currentOrder.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value" :class="getStatusClass(orderStore.currentOrder.status)">
                {{ formatStatus(orderStore.currentOrder.status) }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Amount:</span>
              <span class="info-value total-amount">${{ formatPrice(orderStore.currentOrder.total_amount) }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Shipping Address:</span>
              <span class="info-value">{{ orderStore.currentOrder.shipping_address }}</span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items-card">
          <h2 class="section-title">Order Items</h2>
          <div class="order-items-table-wrapper">
            <table class="order-items-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in (orderStore.currentOrder.orderItems || orderStore.currentOrder.items || [])" :key="item.id">
                  <td class="item-image-cell">
                    <img :src="getItemImage(item)" :alt="item.product?.name" @error="onImageError" />
                  </td>
                  <td class="item-name-cell">{{ item.product?.name }}</td>
                  <td class="item-price-cell">${{ formatPrice(item.price) }}</td>
                  <td class="item-qty-cell">{{ item.quantity }}</td>
                </tr>
                <tr v-if="!orderStore.currentOrder.orderItems || orderStore.currentOrder.orderItems.length === 0">
                  <td colspan="4" class="no-items-cell">No items in this order</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="order-summary-card">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ formatPrice(orderStore.currentOrder.total_amount) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ formatPrice(orderStore.currentOrder.total_amount) }}</span>
          </div>
        </div>

        <div class="order-actions">
          <button @click="goBack" class="btn-back">
            ← Back to Orders
          </button>
        </div>
      </div>

      <div v-else class="empty-order">
        <EmptyState
          icon="📦"
          title="Order not found"
          message="The order you're looking for doesn't exist or you don't have permission to view it."
          link="/orders"
          linkText="Back to Orders"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '../stores/orders';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import EmptyState from '../components/common/EmptyState.vue';
import api from '../api/axios';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const orderId = route.params.id;

onMounted(async () => {
  if (orderId) {
    await orderStore.fetchOrder(orderId);
    // Debug: log the order data to console
    console.log('Order data:', orderStore.currentOrder);
    console.log('Order items:', orderStore.currentOrder?.orderItems);
    console.log('Order items (alt):', orderStore.currentOrder?.items);
  }
});

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

function goBack() {
  router.push('/orders');
}
</script>

<style scoped>
.order-detail-page {
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

.order-detail-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-info-card,
.order-items-card,
.order-summary-card {
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-weight: bold;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.info-value {
  color: #2c3e50;
  font-size: 1.1rem;
}

.info-value.total-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.status-processing {
  background-color: #cce5ff;
  color: #004085;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.status-shipped {
  background-color: #d4edda;
  color: #155724;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.status-delivered {
  background-color: #d1ecf1;
  color: #0c5460;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
}

.order-items-table-wrapper {
  overflow-x: auto;
}

.order-items-table {
  width: 100%;
  border-collapse: collapse;
}

.order-items-table th,
.order-items-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.order-items-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.order-items-table tbody tr:hover {
  background-color: #f8f9fa;
}

.item-image-cell {
  width: 80px;
}

.item-image-cell img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-name-cell {
  font-weight: 500;
  color: #2c3e50;
}

.item-price-cell,
.item-qty-cell,
.item-subtotal-cell {
  color: #555;
}

.item-subtotal-cell {
  font-weight: bold;
  color: #27ae60;
}

.order-summary-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #555;
  font-size: 1.1rem;
}

.summary-row.total {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  padding-top: 1rem;
  border-top: 2px solid #eee;
  margin-top: 1rem;
}

.order-actions {
  display: flex;
  justify-content: flex-start;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-back:hover {
  background-color: #2980b9;
}

.empty-order {
  padding: 2rem 0;
}

.no-items {
  padding: 2rem 0;
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
}

.no-items-cell {
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  padding: 2rem !important;
}

.debug-info {
  font-style: normal;
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
}

.debug-hint {
  font-style: normal;
  font-size: 0.8rem;
  color: #e74c3c;
  margin-top: 0.25rem;
}

/* Hide debug info in production */
.debug-info {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .item-subtotal {
    text-align: left;
  }
}
</style>