import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';

export default function ProductList({ products, addToCart, onView }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [isLoading] = useState(false);

  const categories = [
    { label: 'All' },
    { label: 'Sneakers' },
    { label: 'Apparel' },
    { label: 'Accessories' },
  ];

  const categorized = useMemo(() => {
    return products.map((product) => {
      if (product.id >= 16 && product.id <= 30) return { ...product, category: 'Apparel' };
      if ((product.id >= 31 && product.id <= 45) || product.id >= 66) return { ...product, category: 'Accessories' };
      return { ...product, category: 'Sneakers' };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = categorized.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery = product.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesPrice =
        priceRange === 'all' ||
        (priceRange === 'under-100' && product.price < 100000) ||
        (priceRange === '100-250' && product.price >= 100000 && product.price <= 250000) ||
        (priceRange === '250+' && product.price > 250000);
      return matchesCategory && matchesQuery && matchesPrice;
    });

    if (sort === 'price-low') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-high') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sort === 'name') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [categorized, category, query, priceRange, sort]);

  const formatPrice = (price) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="product-list-container">
      <div className="section-head">
        <div>
          <p className="eyebrow">Featured collection</p>
          <h2>Shop the latest drops</h2>
        </div>
        <div className="filters-row">
          <label className="uiverse-search">
            <span>Search</span>
            <input
              className="uiverse-input"
              placeholder="Sneakers, bags, watches..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search products"
            />
          </label>
          <Form.Select
            className="filter-select"
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
            aria-label="Filter by price range"
          >
            <option value="all">All prices</option>
            <option value="under-100">Under 100k</option>
            <option value="100-250">100k - 250k</option>
            <option value="250+">250k+</option>
          </Form.Select>
          <Form.Select
            className="filter-select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="name">Name: A to Z</option>
          </Form.Select>
        </div>
      </div>

      <div className="category-row">
        {categories.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`category-pill ${category === item.label ? 'active' : ''}`}
            onClick={() => setCategory(item.label)}
          >
            {item.label}
          </button>
        ))}
        <Badge bg="dark" className="ms-auto">{filteredProducts.length} items</Badge>
      </div>

      {isLoading ? (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="loading-card" key={`loading-${index}`}>
              <div className="loading-media" />
              <div className="loading-line" />
              <div className="loading-line short" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h4>No items found.</h4>
          <p>Try another keyword, category, or price range.</p>
          <Button
            variant="dark"
            className="pill-btn"
            onClick={() => {
              setQuery('');
              setCategory('All');
              setPriceRange('all');
              setSort('featured');
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 border-0 product-card-hover lux-card">
                <div className="card-img-wrapper">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="card-chip">{product.category}</span>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  <Card.Text className="product-price">{formatPrice(product.price)}</Card.Text>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      type="button"
                      className="uiverse-cart-btn"
                      onClick={() => addToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <span className="uiverse-cart-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 576 512"
                          aria-hidden="true"
                        >
                          <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                        </svg>
                      </span>
                      <span className="uiverse-cart-text">Add to cart</span>
                    </button>
                    <Button
                      variant="outline-dark"
                      className="ghost-btn"
                      onClick={() => onView?.(product)}
                      aria-label={`View details for ${product.name}`}
                    >
                      View
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
