const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Products table
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price REAL,
    image TEXT,
    description TEXT
  )`);

  // Cart table
  db.run(`CREATE TABLE cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    quantity INTEGER,
    FOREIGN KEY(productId) REFERENCES products(id)
  )`);

  // Insert mock products
  const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300', description: 'Premium sound quality' },
    { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300', description: 'Fitness tracking & notifications' },
    { id: 3, name: 'Laptop Stand', price: 49.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', description: 'Ergonomic aluminum design' },
    { id: 4, name: 'Mechanical Keyboard', price: 129.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300', description: 'RGB backlit gaming keyboard' },
    { id: 5, name: 'USB-C Hub', price: 39.99, image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300', description: '7-in-1 connectivity' },
    { id: 6, name: 'Webcam HD', price: 89.99, image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=300', description: '1080p video quality' },
    { id: 7, name: 'Desk Lamp', price: 34.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300', description: 'LED with adjustable brightness' },
    { id: 8, name: 'Mouse Pad XL', price: 24.99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300', description: 'Extended gaming surface' }
  ];

  const stmt = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?)');
  products.forEach(p => stmt.run(p.id, p.name, p.price, p.image, p.description));
  stmt.finalize();
});

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET /api/cart - Get cart items with total
app.get('/api/cart', (req, res) => {
  const query = `
    SELECT c.id, c.productId, c.quantity, p.name, p.price, p.image,
           (c.quantity * p.price) as subtotal
    FROM cart c
    JOIN products p ON c.productId = p.id
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const total = rows.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: rows, total: parseFloat(total.toFixed(2)) });
  });
});

// POST /api/cart - Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  // Check if product exists
  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, existing) => {
      if (existing) {
        // Update quantity
        const newQty = existing.quantity + quantity;
        db.run('UPDATE cart SET quantity = ? WHERE productId = ?', [newQty, productId], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Cart updated', productId, quantity: newQty });
        });
      } else {
        // Insert new item
        db.run('INSERT INTO cart (productId, quantity) VALUES (?, ?)', [productId, quantity], function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Item added to cart', id: this.lastID, productId, quantity });
        });
      }
    });
  });
});

// DELETE /api/cart/:id - Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM cart WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Item removed from cart', id });
  });
});

// PUT /api/cart/:id - Update cart item quantity
app.put('/api/cart/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  if (!quantity || quantity < 1) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }

  db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Quantity updated', id, quantity });
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});