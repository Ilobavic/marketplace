import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Button, Form, InputGroup, Badge } from 'react-bootstrap';

export default function ProductList({ products, addToCart }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

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
    return categorized.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesQuery = product.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [categorized, category, query]);

  const formatPrice = (price) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="product-list-container">
      <div className="section-head">
        <div>
          <p className="eyebrow">Featured collection</p>
          <h2>Shop the latest drops</h2>
        </div>
        <InputGroup className="search-input">
          <InputGroup.Text>Search</InputGroup.Text>
          <Form.Control
            placeholder="Sneakers, bags, watches..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
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

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 border-0 product-card-hover lux-card">
              <div className="card-img-wrapper">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                />
                <span className="card-chip">{product.category}</span>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="product-title">{product.name}</Card.Title>
                <Card.Text className="product-price">{formatPrice(product.price)}</Card.Text>
                <div className="mt-auto d-flex gap-2">
                  <Button
                    className="uiverse-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </Button>
                  <Button variant="outline-dark" className="ghost-btn">
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
