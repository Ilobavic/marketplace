import React, { useState } from 'react';
import { products } from './data';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products'); // 'products' or 'cart'

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="App">
      <header className="navbar">
        <h1>My Shop</h1>
        <button onClick={() => setView('products')}>Products</button>
        <button onClick={() => setView('cart')}>
          Cart ({cartItemCount})
        </button>
      </header>

      <main>
        {view === 'products' ? (
          <ProductList products={products} addToCart={addToCart} />
        ) : (
          <Cart 
            cartItems={cart} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
