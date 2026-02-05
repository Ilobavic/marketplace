import React, { useState } from 'react';
import { products } from './data';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import { Container, Navbar, Nav, Badge, Button } from 'react-bootstrap';
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
    // alert(`${product.name} added to cart!`); // Removed alert for better UX
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
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="mb-4">
        <Container>
          <Navbar.Brand href="#" onClick={() => setView('products')} className="d-flex align-items-center">
            <img
              alt="Logo"
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />{' '}
            LuxMarket
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => setView('products')} active={view === 'products'}>Products</Nav.Link>
              <Nav.Link onClick={() => setView('cart')} active={view === 'cart'}>
                Cart <Badge bg="primary">{cartItemCount}</Badge>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {view === 'products' ? (
          <ProductList products={products} addToCart={addToCart} />
        ) : (
          <Cart 
            cartItems={cart} 
            removeFromCart={removeFromCart} 
            updateQuantity={updateQuantity} 
          />
        )}
      </Container>
      
      <footer className="text-center py-4 mt-5 bg-light">
        <p className="mb-0 text-muted">&copy; 2024 LuxMarket. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
