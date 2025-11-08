import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '' });

  // Fetch products
  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const addToCart = async (productId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      
      if (!res.ok) throw new Error('Failed to add to cart');
      
      await fetchCart();
      alert('Item added to cart!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to remove item');
      
      await fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    
    try {
      const res = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty })
      });
      
      if (!res.ok) throw new Error('Failed to update quantity');
      
      await fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (cart.items.length === 0) {
      setError('Cart is empty');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart.items,
          name: checkoutForm.name,
          email: checkoutForm.email
        })
      });

      if (!res.ok) throw new Error('Checkout failed');

      const data = await res.json();
      setReceipt(data);
      setShowReceipt(true);
      setShowCheckout(false);
      setCheckoutForm({ name: '', email: '' });
      await fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🛒 Vibe Commerce</h1>
        <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
          Cart ({cart.items.length}) - ${cart.total.toFixed(2)}
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      {/* Products Grid */}
      {!showCart && !showCheckout && (
        <div className="products-container">
          <h2>Our Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="description">{product.description}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => addToCart(product.id)}
                  disabled={loading}
                  className="add-btn"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart View */}
      {showCart && !showCheckout && (
        <div className="cart-container">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button onClick={() => setShowCart(false)} className="back-btn">
              ← Back to Products
            </button>
          </div>

          {cart.items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.items.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <p className="subtotal">${item.subtotal.toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Total: ${cart.total.toFixed(2)}</h3>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="checkout-btn"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Checkout Form */}
      {showCheckout && (
        <div className="checkout-container">
          <div className="cart-header">
            <h2>Checkout</h2>
            <button onClick={() => setShowCheckout(false)} className="back-btn">
              ← Back to Cart
            </button>
          </div>

          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm({...checkoutForm, name: e.target.value})}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              {cart.items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total:</strong>
                <strong>${cart.total.toFixed(2)}</strong>
              </div>
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Processing...' : 'Complete Order'}
            </button>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receipt && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>✅ Order Confirmed!</h2>
            <div className="receipt">
              <p><strong>Order ID:</strong> {receipt.orderId}</p>
              <p><strong>Customer:</strong> {receipt.customerName}</p>
              <p><strong>Email:</strong> {receipt.customerEmail}</p>
              <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
              
              <h3>Items:</h3>
              <ul>
                {receipt.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
              
              <h3>Total: ${receipt.total.toFixed(2)}</h3>
            </div>
            
            <button 
              onClick={() => {
                setShowReceipt(false);
                setShowCart(false);
              }}
              className="close-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;