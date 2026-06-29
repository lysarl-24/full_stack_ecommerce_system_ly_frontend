<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>About Us</h3>
        <p>Your one-stop shop for all your needs. Quality products at the best prices.</p>
      </div>

      <div class="footer-section">
        <h3>Quick Links</h3>
        <router-link to="/">Home</router-link>
        <router-link to="/products">Products</router-link>
        <router-link to="/cart">Cart</router-link>
      </div>

      <div class="footer-section">
        <h3>Customer Service</h3>
        <a href="#">Contact Us</a>
        <a href="#">Shipping Info</a>
        <a href="#">Returns</a>
        <a href="#">FAQ</a>
      </div>

      <div class="footer-section">
        <h3>Contact Info</h3>
        <p>Email: support@example.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Street, City, Country</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 E-Commerce Store. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
// No script needed for static footer
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0 0;
  margin-top: 3rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3 {
  color: #3498db;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section p {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #bdc3c7;
}

.footer-section a {
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  margin: 0.5rem 0;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #3498db;
}

.footer-bottom {
  background-color: #1a252f;
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;
}

.footer-bottom p {
  margin: 0;
  color: #bdc3c7;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>