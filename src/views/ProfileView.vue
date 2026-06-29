<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-header">
        <div class="profile-avatar-container">
          <div class="profile-avatar">
            <img v-if="imagePreview" :src="imagePreview" alt="Profile" />
            <span v-else>{{ profileInitial }}</span>
          </div>
          <label for="profile-image-input" class="avatar-upload-label">
            <span class="upload-icon">📷</span>
          </label>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            class="profile-image-input"
            @change="handleImageUpload"
          />
        </div>
        <div class="profile-name">
          <h1 class="page-title">{{ authStore.user?.name || 'My Profile' }}</h1>
          <p class="profile-email">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <div class="profile-content">
        <!-- Profile Information -->
        <div class="profile-section">
          <h2 class="section-title">Profile Information</h2>

          <form @submit.prevent="updateProfile" class="profile-form">
            <div v-if="profileError" class="error-message">
              {{ profileError }}
            </div>
            <div v-if="profileSuccess" class="success-message">
              {{ profileSuccess }}
            </div>

            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                v-model="profileForm.name"
                type="text"
                id="name"
                placeholder="Your name"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                v-model="profileForm.email"
                type="email"
                id="email"
                placeholder="Your email"
                class="form-input"
              />
            </div>

            <button 
              type="submit" 
              class="btn-update"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Updating...' : 'Update Profile' }}
            </button>
          </form>
        </div>

        <!-- Change Password -->
        <div class="profile-section">
          <h2 class="section-title">Change Password</h2>

          <form @submit.prevent="changePassword" class="password-form">
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>
            <div v-if="passwordSuccess" class="success-message">
              {{ passwordSuccess }}
            </div>

            <div class="form-group">
              <label for="current_password">Current Password</label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                id="current_password"
                placeholder="Enter current password"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="new_password">New Password</label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                id="new_password"
                placeholder="Enter new password"
                required
                minlength="8"
                class="form-input"
              />
              <small class="form-help">Minimum 8 characters</small>
            </div>

            <div class="form-group">
              <label for="new_password_confirmation">Confirm New Password</label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                id="new_password_confirmation"
                placeholder="Confirm new password"
                required
                class="form-input"
              />
            </div>

            <button 
              type="submit" 
              class="btn-change-password"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Changing...' : 'Change Password' }}
            </button>
          </form>
        </div>

        <!-- Account Info -->
        <div class="profile-section account-info">
          <h2 class="section-title">Account Information</h2>
          <div class="info-row">
            <span class="info-label">Member since:</span>
            <span class="info-value">{{ formatDate(authStore.user?.created_at) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Account status:</span>
            <span class="info-value status-active">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';

const authStore = useAuthStore();

const profileError = ref('');
const profileSuccess = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');
const selectedImage = ref(null);
const imagePreview = ref(null);

const profileForm = reactive({
  name: '',
  email: '',
  image: null,
});

const profileInitial = ref('');

onMounted(() => {
  // Pre-fill profile form with user data
  if (authStore.user) {
    profileForm.name = authStore.user.name || '';
    profileForm.email = authStore.user.email || '';
    // Get first letter of name for avatar
    profileInitial.value = authStore.user.name ? authStore.user.name.charAt(0).toUpperCase() : 'U';
    // Set image preview if user has image
    if (authStore.user.image) {
      imagePreview.value = `${api.defaults.baseURL.replace('/api', '')}/storage/${authStore.user.image}`;
    }
  }
});

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      profileError.value = 'Please select an image file';
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      profileError.value = 'Image size must be less than 2MB';
      return;
    }

    selectedImage.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Upload image
    uploadImage(file);
  }
}

async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    profileSuccess.value = 'Profile image updated successfully!';
    
    // Update user data in store
    if (response.data.data && response.data.data.image) {
      authStore.user.image = response.data.data.image;
    }
    
    setTimeout(() => {
      profileSuccess.value = '';
    }, 3000);
  } catch (err) {
    profileError.value = err.response?.data?.message || 'Failed to upload image';
  }
}


async function updateProfile() {
  profileError.value = '';
  profileSuccess.value = '';

  if (!profileForm.name || !profileForm.email) {
    profileError.value = 'Name and email are required';
    return;
  }

  try {
    await authStore.updateProfile({
      name: profileForm.name,
      email: profileForm.email,
    });
    profileSuccess.value = 'Profile updated successfully!';
    // Clear success message after 3 seconds
    setTimeout(() => {
      profileSuccess.value = '';
    }, 3000);
  } catch (err) {
    profileError.value = err.response?.data?.message || 'Failed to update profile';
  }
}

async function changePassword() {
  passwordError.value = '';
  passwordSuccess.value = '';

  // Validation
  if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
    passwordError.value = 'Please fill in all password fields';
    return;
  }

  if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (passwordForm.new_password.length < 8) {
    passwordError.value = 'New password must be at least 8 characters';
    return;
  }

  try {
    await authStore.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.new_password,
      password_confirmation: passwordForm.new_password_confirmation,
    });
    passwordSuccess.value = 'Password changed successfully!';
    // Reset form
    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.new_password_confirmation = '';
    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccess.value = '';
    }, 3000);
  } catch (err) {
    passwordError.value = err.response?.data?.message || 'Failed to change password';
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: 100vh;
}

.page-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin: 0 0 2rem;
  text-align: center;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload-label {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background-color 0.3s;
}

.avatar-upload-label:hover {
  background: #2980b9;
}

.upload-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.profile-image-input {
  display: none;
}

.profile-name {
  flex: 1;
}

.profile-name .page-title {
  margin: 0 0 0.5rem;
  text-align: left;
}

.profile-email {
  margin: 0;
  color: #7f8c8d;
  font-size: 1rem;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-section {
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

.profile-form,
.password-form {
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

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #28a745;
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

.btn-update,
.btn-change-password {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-update {
  background-color: #3498db;
  color: white;
}

.btn-update:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-change-password {
  background-color: #27ae60;
  color: white;
}

.btn-change-password:hover:not(:disabled) {
  background-color: #229954;
}

.btn-update:disabled,
.btn-change-password:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.account-info {
  background: #f8f9fa;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: bold;
  color: #2c3e50;
}

.info-value {
  color: #555;
}

.info-value.status-active {
  color: #27ae60;
  font-weight: bold;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .profile-section {
    padding: 1.5rem;
  }

  .info-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>