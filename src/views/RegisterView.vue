<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Join us and start shopping today!</p>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="Enter your full name"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              placeholder="Create a password"
              required
              minlength="8"
              class="form-input"
            />
            <small class="form-help">Minimum 8 characters</small>
          </div>

          <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input
              v-model="form.password_confirmation"
              type="password"
              id="password_confirmation"
              placeholder="Confirm your password"
              required
              class="form-input"
            />
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account? 
            <router-link to="/login">Login here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const error = ref('');

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});

async function handleRegister() {
  error.value = '';

  // Validation
  if (!form.name || !form.email || !form.password || !form.password_confirmation) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (form.password !== form.password_confirmation) {
    error.value = 'Passwords do not match';
    return;
  }

  if (form.password.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    // Redirect to home after successful registration
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.';
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.auth-title {
  font-size: 2rem;
  color: #2c3e50;
  margin: 0 0 0.5rem;
  text-align: center;
}

.auth-subtitle {
  color: #7f8c8d;
  text-align: center;
  margin: 0 0 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.error-message {
  background-color: #fee;
  color: #c0392b;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #c0392b;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-input {
  padding: 0.85rem 1rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.form-help {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
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

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  color: #7f8c8d;
}

.auth-footer a {
  color: #3498db;
  font-weight: bold;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>