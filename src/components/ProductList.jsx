import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function ProductList({ products, addToCart }) {
  return (
    <div className="product-list-container">
      <h2 className="mb-4 text-center">Featured Collection</h2>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <article className="retro-card">
              <div className="retro-media" aria-hidden="true">
                <div className="retro-sweater">
                  <div className="sweater-collar" />
                  <div className="sweater-arm sweater-arm-left" />
                  <div className="sweater-arm sweater-arm-right" />
                  <div className="sweater-base" />
                </div>
              </div>
              <div className="retro-body">
                <h3 className="retro-title">{product.name}</h3>
                <p className="retro-desc">
                  Product description. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div className="retro-divider" role="presentation" />
              <div className="retro-footer">
                <span className="retro-price">${product.price.toFixed(2)}</span>
                <button
                  type="button"
                  className="retro-cart-btn"
                  onClick={() => addToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6.2 5h13.9c.6 0 1 .5.9 1.1l-1.3 7.2c-.1.5-.5.9-1 .9H8.2c-.5 0-.9-.3-1-.8L5.4 3.7H2.5a.9.9 0 1 1 0-1.8h3.6c.4 0 .7.3.8.6L7.4 5z" />
                  </svg>
                </button>
              </div>
            </article>
          </Col>
        ))}
      </Row>
    </div>
  );
}
