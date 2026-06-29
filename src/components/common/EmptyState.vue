<template>
  <div class="empty-state">
    <div class="empty-icon">{{ icon }}</div>
    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>
    <router-link v-if="link" :to="link" class="empty-action">
      {{ linkText }}
    </router-link>
    <button v-else-if="action" @click="handleAction" class="empty-action">
      {{ actionText }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: '📦',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  linkText: {
    type: String,
    default: 'Go to Products',
  },
  action: {
    type: Function,
    default: null,
  },
  actionText: {
    type: String,
    default: 'Try Again',
  },
});

function handleAction() {
  if (props.action) {
    props.action();
  }
}
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin: 0 0 1rem;
}

.empty-message {
  color: #7f8c8d;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.empty-action {
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.empty-action:hover {
  background-color: #2980b9;
}
</style>