<template>
  <div class="review-list">
    <h3 class="review-list-title">Customer Reviews ({{ reviews.length }})</h3>

    <div v-if="reviews.length === 0" class="no-reviews">
      <p>No reviews yet. Be the first to review this product!</p>
    </div>

    <div v-else class="reviews">
      <div v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-header">
          <div class="review-user">
            <span class="review-name">{{ review.user?.name || 'Anonymous' }}</span>
            <span class="review-date">{{ formatDate(review.created_at) }}</span>
          </div>
          <div class="review-rating">
            <span v-for="star in 5" :key="star" class="star">
              {{ star <= review.rating ? '⭐' : '☆' }}
            </span>
          </div>
        </div>
        <p class="review-comment">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reviews: {
    type: Array,
    default: () => [],
  },
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
</script>

<style scoped>
.review-list {
  margin-top: 2rem;
}

.review-list-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3498db;
}

.no-reviews {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  background: #f8f9fa;
  border-radius: 8px;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.review-user {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.review-name {
  font-weight: bold;
  color: #2c3e50;
}

.review-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.review-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  font-size: 1.1rem;
}

.review-comment {
  color: #555;
  line-height: 1.6;
  margin: 0;
}
</style>