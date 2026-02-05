import React from 'react';
import { Card, Button, ListGroup, Row, Col, Image } from 'react-bootstrap';

export default function Cart({ cartItems, removeFromCart, updateQuantity, onCheckout }) {
  const formatPrice = (price) => `NGN ${price.toLocaleString()}`;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-head">
        <div>
          <p className="eyebrow">Your picks</p>
          <h2>Shopping cart</h2>
        </div>
        <span className="cart-count">{cartItems.length} items</span>
      </div>
      {cartItems.length === 0 ? (
        <Card className="text-center p-5 shadow-sm empty-cart">
          <Card.Body>
            <h4>Your cart is currently empty.</h4>
            <p>Start shopping to add items to your cart.</p>
            <Button variant="dark" className="pill-btn">Browse collections</Button>
          </Card.Body>
        </Card>
      ) : (
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4 cart-list">
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.id} className="p-3">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col xs={9} sm={4}>
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">Unit: {formatPrice(item.price)}</small>
                      </Col>
                      <Col xs={6} sm={3} className="my-2 my-sm-0">
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >-</Button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >+</Button>
                        </div>
                      </Col>
                      <Col xs={6} sm={3} className="text-end">
                        <div className="fw-bold mb-2">{formatPrice(item.price * item.quantity)}</div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow-sm border-0 order-summary">
              <Card.Body>
                <Card.Title>Order summary</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Protection</span>
                  <span>Included</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-5">
                  <strong>Total</strong>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <Button
                  variant="dark"
                  size="lg"
                  className="w-100 pill-btn"
                  onClick={onCheckout}
                >
                  Proceed to checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
