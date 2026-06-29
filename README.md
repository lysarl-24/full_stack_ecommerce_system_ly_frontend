# E-Commerce Frontend

A modern Vue 3 e-commerce frontend that consumes Laravel REST API endpoints.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Build tool and dev server
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - State management library
- **Axios** - HTTP client for API requests
- **TypeScript** - Type-safe JavaScript

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with auth interceptor
├── components/
│   ├── layout/
│   │   ├── Navbar.vue        # Navigation bar with cart/wishlist counts
│   │   └── Footer.vue        # Site footer
│   ├── products/
│   │   └── ProductCard.vue   # Reusable product card component
│   ├── cart/
│   │   └── CartItemRow.vue   # Cart item with quantity controls
│   ├── wishlist/
│   │   └── (components)
│   ├── reviews/
│   │   ├── ReviewList.vue    # Display product reviews
│   │   └── ReviewForm.vue    # Form to add new review
│   └── common/
│       ├── SearchBar.vue     # Search input component
│       ├── LoadingSpinner.vue # Loading indicator
│       └── EmptyState.vue    # Empty state placeholder
├── views/
│   ├── HomeView.vue          # Home page with hero, featured products
│   ├── ProductsView.vue      # Product listing with filters
│   ├── ProductDetailView.vue # Single product page
│   ├── LoginView.vue         # User login
│   ├── RegisterView.vue      # User registration
│   ├── WishlistView.vue      # User wishlist
│   ├── CartView.vue          # Shopping cart
│   ├── CheckoutView.vue      # Checkout form
│   ├── OrdersView.vue        # Order history
│   └── ProfileView.vue       # User profile management
├── stores/
│   ├── auth.js               # Authentication state
│   ├── products.js           # Products and categories
│   ├── cart.js               # Shopping cart
│   ├── wishlist.js           # User wishlist
│   └── orders.js             # Order management
├── router/
│   └── index.js              # Vue Router configuration
├── App.vue                   # Root component
└── main.ts                   # Application entry point
```

## Features

### Public Pages
- **Home Page**: Hero section, featured products, categories, latest products
- **Products Page**: Product grid with search, category filter, price filter, pagination
- **Product Detail**: Product info, add to cart, add to wishlist, reviews
- **Login/Register**: User authentication with form validation

### Protected Pages (Login Required)
- **Wishlist**: View saved items, add to cart, remove items
- **Cart**: View cart items, update quantities, remove items, see total
- **Checkout**: Shipping form, payment method selection, place order
- **Orders**: View order history with status
- **Profile**: Update name/email, change password

### Key Features
- ✅ JWT token-based authentication with localStorage
- ✅ Protected routes with automatic redirect
- ✅ Dynamic cart and wishlist counts in navbar
- ✅ Real-time API integration with Laravel backend
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Reusable components
- ✅ Clean, modern UI with consistent styling

## Getting Started

### Prerequisites

- Node.js (v22 or v24)
- npm or yarn
- Laravel backend API running (default: http://localhost:8000)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL (if needed):
   
   Edit `src/api/axios.js` and change the `baseURL` to match your Laravel API URL:
   ```javascript
   baseURL: 'http://localhost:8000/api',
   ```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## API Endpoints Used

### Public Endpoints
- `GET /api/categories` - Fetch all categories
- `GET /api/products` - Fetch products (with pagination)
- `GET /api/products/{id}` - Fetch single product
- `GET /api/products/search?q=keyword` - Search products

### Authentication Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `PUT /api/change-password` - Change password

### Wishlist Endpoints
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/{product}` - Add to wishlist
- `DELETE /api/wishlist/{product}` - Remove from wishlist

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove from cart

### Orders Endpoints
- `POST /api/checkout` - Place order
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get single order

### Reviews Endpoints
- `GET /api/products/{id}/reviews` - Get product reviews
- `POST /api/products/{id}/reviews` - Add review

## State Management (Pinia Stores)

### Auth Store
- Manages user authentication state
- Handles login, register, logout
- Stores token and user data in localStorage
- Auto-restores auth state on page refresh

### Products Store
- Fetches products and categories
- Handles search and filtering
- Manages product reviews

### Cart Store
- Manages shopping cart items
- Add/remove/update quantities
- Calculates cart total and item count

### Wishlist Store
- Manages user wishlist
- Add/remove items
- Tracks wishlist count

### Orders Store
- Fetches user orders
- Handles checkout process
- Clears cart after successful order

## Authentication Flow

1. User logs in with email/password
2. Backend returns token and user data
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. If token expires (401), user is redirected to login
6. Protected routes check authentication before access

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- Make sure your Laravel backend has CORS configured to allow requests from this frontend
- The API base URL can be configured in `src/api/axios.js`
- All API responses should return JSON format
- The backend should implement Laravel Sanctum for API authentication

## Student-Friendly Features

- Clear comments in all files
- Consistent code structure
- Reusable components
- Proper error handling
- Loading states for better UX
- Form validation examples
- Responsive design patterns
- Real API integration (no mock data)

## Next Steps

1. Configure your Laravel API URL in `src/api/axios.js`
2. Run `npm run dev` to start the development server
3. Test the application with your Laravel backend
4. Customize the styling to match your brand
5. Add more features as needed (order details page, product reviews pagination, etc.)

## Support

This is a student-friendly project with clear code structure and comments. Feel free to modify and extend it according to your needs!