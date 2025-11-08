# Vibe Commerce – E-Commerce Cart Application

## 🚀 Features
- Product Catalog: 8 mock products with images and descriptions  
- Shopping Cart: Add, remove, update quantities  
- Real-time Totals  
- Checkout Flow  
- Mock Receipt with order ID and timestamp  
- Responsive Design  
- Error Handling  
- SQLite Persistence  

## 📁 Project Structure

vibe-commerce/
├── backend/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── index.js
    └── package.json



## 🛠️ Setup Instructions

### Prerequisites
- Node.js v14+
- npm or yarn

### Backend Setup
``` bash
mkdir backend
cd backend
npm install
npm start
```


Server runs on http://localhost:5000


## Frontend Setup

Create React app:

``` bash
npx create-react-app frontend
cd frontend
npm start
```

Frontend runs on http://localhost:3000.

Replace App.jsx, App.css, index.js, and update package.json as per artifacts.

Update package.json 
Install and start:

``` bash

npm install
npm start
```
Frontend runs on http://localhost:3000

# 🎯 API Endpoints
## Products
``` bash
GET /api/products - Fetch all products
```
## Cart
``` bash
GET /api/cart - Get cart items and total
POST /api/cart - Add item to cart

json  { "productId": 1, "quantity": 1 }

PUT /api/cart/:id - Update item quantity

json  { "quantity": 2 }

DELETE /api/cart/:id - Remove item from cart
```
## Checkout
``` bash
POST /api/checkout - Complete purchase

json  {
    "cartItems": [...],
    "name": "John Doe",
    "email": "john@example.com"
  }

```
## 🧪 Testing Steps

- Load 8 products

- Add to cart

- Update quantities

- Remove items

- Empty cart

- Checkout

- Validate receipt

- Confirm cart clears

# 📸 Screenshots

## Products Page

## Shopping Cart

## Checkout

## Order Confirmation

# 🎥 Demo Video
Watch the full demo: (click here)[clickhere]

## The video demonstrates:

- Browsing products catalog
- Adding items to cart
- Updating quantities and removing items
- Checkout process
- Order confirmation

# 💡 Implementation Details
## Backend

Express.js: RESTful API server
SQLite: In-memory database for quick setup
CORS: Enabled for frontend communication
Mock Data: 8 products pre-populated on startup

## Frontend

React Hooks: useState and useEffect for state management
Fetch API: Async calls to backend
Conditional Rendering: Switch between views (products/cart/checkout)
Form Validation: Required fields for checkout
Responsive CSS: Flexbox and Grid layout

# Features Implemented
- ✅ All required API endpoints
- ✅ Product catalog display
- ✅ Add/remove cart functionality
- ✅ Quantity updates
- ✅ Real-time total calculation
- ✅ Checkout form with validation
- ✅ Mock receipt generation
- ✅ Responsive design
- ✅ Error handling
- ✅ Database persistence

## 🎨 Bonus Features

- ✅ Database persistence with SQLite
- ✅ Comprehensive error handling
- ✅ Professional UI/UX design
- ✅ Cart quantity updates
- ✅ Detailed order receipts with timestamps

# 🚀 Deployment to GitHub

## Initialize git in project root:

``` bash
git init
git add .
git commit -m "Initial commit: Full-stack e-commerce cart"
```

## Create GitHub repository and push:

``` bash
git remote add origin <your-repo-url>
git push -u origin main
``` 

## Ensure README.md includes:

- Setup instructions
- API documentation
- Screenshots description
- Demo video link



# 📝 Technologies Used
## Frontend:

- React 18
- CSS3 (Flexbox, Grid)
- Fetch API

## Backend:

- Node.js
- Express.js
- SQLite3
- CORS

## 👤 Author
# Aviral Yadav
Vibe Commerce


