import React, { useState } from 'react';
import { products } from './data';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Payout from './components/Payout';
import { Container, Navbar, Nav, Badge, Button } from 'react-bootstrap';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setView('detail');
  };

  return (
    <div className="App">
      <Navbar expand="lg" sticky="top" className="lux-nav">
        <Container>
          <Navbar.Brand href="#" onClick={() => setView('products')} className="d-flex align-items-center gap-2">
            <img
              alt="LuxMarket logo"
              src="/logo-canva.png"
              width="34"
              height="34"
              className="brand-logo"
            />
            <div className="brand-text">
              <span>LuxMarket</span>
              <small>Modern fashion marketplace</small>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="lux-nav" />
          <Navbar.Collapse id="lux-nav">
            <Nav className="ms-auto align-items-lg-center gap-lg-3">
              <Nav.Link onClick={() => setView('products')} active={view === 'products'}>
                Shop
              </Nav.Link>
              <Nav.Link onClick={() => setView('cart')} active={view === 'cart'}>
                Cart <Badge bg="dark" className="ms-1">{cartItemCount}</Badge>
              </Nav.Link>
              <Nav.Link onClick={() => setView('payout')} active={view === 'payout'}>
                Payout
              </Nav.Link>
              <Button variant="outline-light" className="pill-btn">
                Join the Club
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {view === 'products' ? (
        <>
          <section className="hero">
            <Container className="hero-inner">
              <div className="hero-copy">
                <p className="eyebrow">Seasonal edit</p>
                <h1>Curated fashion that feels effortless.</h1>
                <p className="subhead">
                  Discover designer essentials, rare sneakers, and statement accessories in one immersive
                  marketplace.
                </p>
                <div className="hero-actions">
                  <Button variant="dark" size="lg" className="pill-btn" onClick={() => setView('products')}>
                    Shop the drop
                  </Button>
                  <Button variant="outline-dark" size="lg" className="pill-btn">
                    View lookbook
                  </Button>
                </div>
                <div className="hero-stats">
                  <div>
                    <strong>1200+</strong>
                    <span>Luxury listings</span>
                  </div>
                  <div>
                    <strong>24h</strong>
                    <span>Express dispatch</span>
                  </div>
                  <div>
                    <strong>4.9</strong>
                    <span>Average rating</span>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-card">
                  <span>Editor pick</span>
                  <h3>Street luxe essentials</h3>
                  <p>Handpicked styles with premium finishes and bold silhouettes.</p>
                  <Button variant="light" className="pill-btn">
                    Explore capsule
                  </Button>
                </div>
                <div className="hero-image" aria-hidden="true" />
              </div>
            </Container>
          </section>

          <section className="trust-bar">
            <Container>
              <div className="trust-grid">
                <div>
                  <h4>Authenticated</h4>
                  <p>Every item verified by our fashion concierge.</p>
                </div>
                <div>
                  <h4>Flexible payments</h4>
                  <p>Split payments with secure checkout protection.</p>
                </div>
                <div>
                  <h4>Global delivery</h4>
                  <p>Ship worldwide with real-time tracking.</p>
                </div>
              </div>
            </Container>
          </section>

          <section className="lookbook">
            <Container>
              <div className="lookbook-head">
                <div>
                  <p className="eyebrow">Lookbook</p>
                  <h2>Build your next signature fit</h2>
                </div>
                <Button variant="outline-dark" className="pill-btn">
                  View full lookbook
                </Button>
              </div>
              <div className="lookbook-grid">
                {[
                  {
                    title: 'After-hours tailoring',
                    note: 'Silk layers, sharp lines, midnight sheen.',
                    image:
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
                  },
                  {
                    title: 'Street luxe essentials',
                    note: 'Oversized fits with premium accessories.',
                    image:
                      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
                  },
                  {
                    title: 'Resort minimal',
                    note: 'Soft neutrals built for every escape.',
                    image:
                      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
                  },
                ].map((look) => (
                  <article className="lookbook-card" key={look.title}>
                    <div className="lookbook-image" style={{ backgroundImage: `url(${look.image})` }} />
                    <div className="lookbook-body">
                      <h3>{look.title}</h3>
                      <p>{look.note}</p>
                      <div className="lookbook-actions">
                        <Button variant="dark" className="pill-btn">Shop the edit</Button>
                        <button className="btn-save">
                          <svg viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Container>
          </section>

          <Container className="product-shell">
            <ProductList
              products={products}
              addToCart={addToCart}
              onView={openProductDetail}
            />
          </Container>
        </>
      ) : view === 'cart' ? (
        <Container className="cart-shell">
          <Cart
            cartItems={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            onCheckout={() => setView('payout')}
          />
        </Container>
      ) : view === 'detail' && selectedProduct ? (
        <Container className="detail-shell">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setView('products')}
            addToCart={addToCart}
            onBuyNow={() => setView('payout')}
          />
        </Container>
      ) : (
        <Container className="payout-shell">
          <Payout total={cartTotal} onBack={() => setView('cart')} />
        </Container>
      )}

      <footer className="lux-footer">
        <Container className="footer-inner">
          <div>
            <h4>LuxMarket</h4>
            <p>Premium marketplace for modern wardrobes and future classics.</p>
          </div>
          <div className="footer-links">
            <span>Customer care</span>
            <span>Shipping & returns</span>
            <span>Gift cards</span>
            <span>Careers</span>
          </div>
          <div className="footer-note">
            <p>&copy; 2026 LuxMarket. All rights reserved.</p>
            <small>Designed for smooth, app-like shopping on every screen.</small>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default App;
