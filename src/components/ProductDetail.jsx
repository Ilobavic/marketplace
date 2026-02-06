import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';

export default function ProductDetail({ product, onBack, addToCart, onBuyNow }) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Forest');

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Forest', 'Noir', 'Sand', 'Sky'];

  const formatPrice = (price) => `NGN ${price.toLocaleString()}`;

  return (
    <div className="detail-card">
      <button type="button" className="link-back" onClick={onBack}>
        ← Back to shop
      </button>
      <div className="detail-grid">
        <div className="detail-media">
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </div>
        <div className="detail-info">
          <p className="eyebrow">Limited edit</p>
          <h2>{product.name}</h2>
          <p className="detail-desc">
            Crafted for statement looks with premium materials and a tailored finish. Ships within 24 hours
            with authentication included.
          </p>
          <div className="detail-meta">
            <Badge bg="dark">Authenticity checked</Badge>
            <Badge bg="light" text="dark">Free returns</Badge>
          </div>

          <div className="detail-options">
            <div>
              <span>Size</span>
              <div className="chip-row">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`chip ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span>Color</span>
              <div className="chip-row">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`chip ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="detail-footer">
            <div>
              <p className="detail-price">{formatPrice(product.price)}</p>
              <small>Includes express shipping</small>
            </div>
            <div className="detail-actions">
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
              <Button variant="outline-dark" className="ghost-btn" onClick={onBuyNow}>
                Buy now
              </Button>
            </div>
          </div>

          <div className="detail-note">
            Selected: {selectedSize} · {selectedColor}
          </div>
        </div>
      </div>
    </div>
  );
}
