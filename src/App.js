import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0 });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/local/login', { username, password });
      alert('Login successful');
      setToken(response.data.token);
    } catch (error) {
      alert('Login failed');
      console.error('Login failed:', error);
    }
  };

  const fetchProducts = async () => {
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/local/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/local/products', newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Product created successfully');
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: 0 });
    } catch (error) {
      alert('Failed to create product');
      console.error('Failed to create product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    try {
      await axios.delete(`http://localhost:3000/local/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter(product => product.id !== id));
      alert('Product deleted successfully');
    } catch (error) {
      alert('Failed to delete product');
      console.error('Failed to delete product:', error);
    }
  };

  return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Product Management 👋</h1>
        </header>
        <main>
          <form onSubmit={handleLogin} className="login-form">
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <button type="submit">Login</button>
          </form>
          {token && (
              <div className="product-form">
                <h2>Create New Product</h2>
                <form onSubmit={handleCreateProduct}>
                  <label>
                    Name:
                    <input type="text" value={newProduct.name}
                           onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}/>
                  </label>
                  <label>
                    Description:
                    <input type="text" value={newProduct.description}
                           onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}/>
                  </label>
                  <label>
                    Price:
                    <input type="number" value={newProduct.price}
                           onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}/>
                  </label>
                  <button type="submit">Create Product</button>
                </form>
                <h2>Products</h2>
                <button onClick={fetchProducts} >Get Products</button>
              </div>
          )}
          {products.length === 0 && <h2>No products</h2>}
          <div className="products-container">
            {products.map(product => (
                <div className="product-card" key={product.id}>
                  <h3>{product.name}</h3>
                  <p><strong>Description:</strong> {product.description}</p>
                  <p><strong>Price:</strong> {product.price}</p>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
            ))}
          </div>
        </main>
      </div>
  );
}

export default App;
