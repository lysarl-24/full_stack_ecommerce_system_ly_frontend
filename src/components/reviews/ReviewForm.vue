<template>
  <div class="review-form">
    <h3 class="form-title">Write a Review</h3>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="rating">Rating</label>
        <div class="rating-input">
          <button 
            v-for="star in 5" 
            :key="star"
            type="button"
            @click="form.rating = star"
            class="star-btn"
            :class="{ active: star <= form.rating }"
          >
            {{ star <= form.rating ? '⭐' : '☆' }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label for="comment">Your Review</label>
        <textarea
          v-model="form.comment"
          id="comment"
          rows="4"
          placeholder="Share your thoughts about this product..."
          required
        ></textarea>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button 
        type="submit" 
        class="submit-btn"
        :disabled="submitting || !form.rating || !form.comment"
      >
        {{ submitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useProductStore } from '../../stores/products';

const props = defineProps({
  productId: {
    type: Number,
    required: true,
  },
});

const authStore = useAuthStore();
const productStore = useProductStore();

const submitting = ref(false);
const error = ref('');

const form = reactive({
  rating: 0,
  comment: '',
});

async function handleSubmit() {
  if (!authStore.isAuthenticated) {
    error.value = 'Please login to submit a review';
    return;
  }

  if (form.rating === 0) {
    error.value = 'Please select a rating';
    return;
  }

  if (!form.comment.trim()) {
    error.value = 'Please write a review';
    return;
  }

  submitting.value = true;
  error.value = '';

  try {
    await productStore.addReview(props.productId, {
      rating: form.rating,
      comment: form.comment,
    });
    // Reset form
    form.rating = 0;
    form.comment = '';
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to submit review';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.review-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

.form-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 0 0 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.star-btn:hover {
  transform: scale(1.2);
}

.star-btn.active {
  opacity: 1;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

textarea:focus {
  outline: none;
  border-color: #3498db;
}

.error-message {
  background-color: #fee;
  color: #c0392b;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #229954;
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}
</style>