<template>
  <div class="search-bar">
    <input
      v-model="searchQuery"
      @keyup.enter="handleSearch"
      type="text"
      placeholder="Search products..."
      class="search-input"
    />
    <button @click="handleSearch" class="search-btn">
      Search
    </button>
    <button 
      v-if="modelValue" 
      @click="handleClear" 
      class="search-clear"
      title="Clear search"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'search', 'clear']);

const searchQuery = ref(props.modelValue);

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue);
});

function handleSearch() {
  emit('search', searchQuery.value);
}

function handleClear() {
  searchQuery.value = '';
  emit('clear');
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #2980b9;
}

.search-clear {
  padding: 0.75rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-clear:hover {
  background-color: #c0392b;
}
</style>