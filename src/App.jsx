import React, { useMemo, useState, useEffect } from 'react';
import { products } from './data';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import ProductDetail from './components/ProductDetail';
import Payout from './components/Payout';
import { Container, Navbar, Nav, Badge, Button, Alert, Form } from 'react-bootstrap';
import { Routes, Route, NavLink, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';

const lookbookItems = [
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
];

function ProductDetailRoute({ onBack, addToCart, onBuyNow }) {
  const { id } = useParams();
  const product = useMemo(
    () => products.find((item) => String(item.id) === String(id)),
    [id]
  );

  if (!product) {
    return (
      <Container className="detail-shell">
        <div className="empty-state">
          <h4>We couldn't find that product.</h4>
          <p>Try browsing the latest drops to discover something new.</p>
          <Button as={Link} to="/" variant="dark" className="pill-btn">
            Back to shop
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="detail-shell">
      <ProductDetail
        product={product}
        onBack={onBack}
        addToCart={addToCart}
        onBuyNow={onBuyNow}
      />
    </Container>
  );
}

function HomeHero({ onShopClick }) {
  return (
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
            <Button variant="dark" size="lg" className="pill-btn" onClick={onShopClick}>
              Shop the drop
            </Button>
            <Button as={Link} to="/#lookbook" variant="outline-dark" size="lg" className="pill-btn">
              View lookbook
            </Button>
          </div>
          <div className="hero-stats" aria-label="Marketplace highlights">
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
            <Button as={Link} to="/#lookbook" variant="light" className="pill-btn">
              Explore capsule
            </Button>
          </div>
          <div className="hero-image" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80"
              alt="Model wearing street luxe outfit"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Home() {
  const handleShopClick = () => {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HomeHero onShopClick={handleShopClick} />

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

      <section className="social-proof" aria-label="Social proof">
        <Container>
          <div className="proof-grid">
            <div className="proof-card">
              <p className="eyebrow">Trusted by stylists</p>
              <h3>“The fastest way to build a luxe wardrobe.”</h3>
              <span>— Kemi Odumosu, Fashion Editor</span>
            </div>
            <div className="proof-card">
              <p className="eyebrow">Press highlight</p>
              <h3>“A sleek marketplace with concierge-level service.”</h3>
              <span>— Style Atlas Weekly</span>
            </div>
            <div className="proof-card">
              <p className="eyebrow">Community rating</p>
              <h3>4.9/5 average score from 2,100+ reviews</h3>
              <span>Verified buyers worldwide</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="lookbook" id="lookbook">
        <Container>
          <div className="lookbook-head">
            <div>
              <p className="eyebrow">Lookbook</p>
              <h2>Build your next signature fit</h2>
            </div>
            <Button as={Link} to="/#lookbook" variant="outline-dark" className="pill-btn">
              View full lookbook
            </Button>
          </div>
          <div className="lookbook-grid">
            {lookbookItems.map((look) => (
              <article className="lookbook-card" key={look.title}>
                <div className="lookbook-image">
                  <img
                    src={look.image}
                    alt={look.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="lookbook-body">
                  <h3>{look.title}</h3>
                  <p>{look.note}</p>
                  <div className="lookbook-actions">
                    <Button as={Link} to="/#products" variant="dark" className="pill-btn">
                      Shop the edit
                    </Button>
                    <button className="btn-save" type="button" aria-label="Save this look">
                      <svg viewBox="0 0 384 512" height="1em" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [clubEmail, setClubEmail] = useState('');
  const [clubStatus, setClubStatus] = useState('idle');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/cart')) {
      document.title = 'Your Cart — LuxMarket';
    } else if (path.startsWith('/payout')) {
      document.title = 'Checkout — LuxMarket';
    } else if (path.startsWith('/product')) {
      document.title = 'Product details — LuxMarket';
    } else {
      document.title = 'LuxMarket — Modern fashion marketplace';
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
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

  const handleClubSubmit = (event) => {
    event.preventDefault();
    if (!clubEmail.trim()) {
      setClubStatus('error');
      return;
    }
    setClubStatus('success');
    setClubEmail('');
  };

  return (
    <div className="App">
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar expand="lg" sticky="top" className="lux-nav">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
            <img
              alt="LuxMarket logo"
              src="/logo-canva.png"
              width="34"
              height="34"
              className="brand-logo"
              loading="lazy"
            />
            <div className="brand-text">
              <span>LuxMarket</span>
              <small>Modern fashion marketplace</small>
            </div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="lux-nav" />
          <Navbar.Collapse id="lux-nav">
            <Nav className="ms-auto align-items-lg-center gap-lg-3">
              <Nav.Link as={NavLink} to="/" end>
                Shop
              </Nav.Link>
              <Nav.Link as={NavLink} to="/cart">
                Cart <Badge bg="dark" className="ms-1">{cartItemCount}</Badge>
              </Nav.Link>
              <Nav.Link as={NavLink} to="/payout">
                Payout
              </Nav.Link>
              <Button
                variant="outline-light"
                className="pill-btn"
                onClick={() => navigate('/#club')}
              >
                Join the Club
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main id="main" className="page" key={location.pathname + location.hash}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Container className="product-shell" id="products">
                  <ProductList
                    products={products}
                    addToCart={addToCart}
                    onView={(product) => navigate(`/product/${product.id}`)}
                  />
                </Container>
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <Container className="cart-shell">
                <Cart
                  cartItems={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  onCheckout={() => navigate('/payout')}
                  onBrowse={() => navigate('/')}
                />
              </Container>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailRoute
                onBack={() => navigate('/')}
                addToCart={addToCart}
                onBuyNow={() => navigate('/payout')}
              />
            }
          />
          <Route
            path="/payout"
            element={
              <Container className="payout-shell">
                <Payout total={cartTotal} onBack={() => navigate('/cart')} />
              </Container>
            }
          />
          <Route
            path="*"
            element={
              <Container className="detail-shell">
                <div className="empty-state">
                  <h4>We couldn't find that page.</h4>
                  <p>Try the homepage to explore new arrivals.</p>
                  <Button as={Link} to="/" variant="dark" className="pill-btn">
                    Back to shop
                  </Button>
                </div>
              </Container>
            }
          />
        </Routes>
      </main>

      <section className="club" id="club">
        <Container className="club-inner">
          <div>
            <p className="eyebrow">Join the Club</p>
            <h2>Get first access to drops and styling notes.</h2>
            <p className="subhead">Weekly curation, zero spam. Cancel anytime.</p>
          </div>
          <Form className="club-form" onSubmit={handleClubSubmit}>
            <Form.Control
              type="email"
              placeholder="you@luxmarket.com"
              value={clubEmail}
              onChange={(event) => setClubEmail(event.target.value)}
              aria-label="Email address"
            />
            <Button type="submit" variant="dark" className="pill-btn">
              Notify me
            </Button>
          </Form>
          {clubStatus === 'success' && (
            <Alert variant="success" className="club-alert">
              You're on the list. We'll be in touch before the next drop.
            </Alert>
          )}
          {clubStatus === 'error' && (
            <Alert variant="warning" className="club-alert">
              Please add a valid email to join the club.
            </Alert>
          )}
        </Container>
      </section>

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
