import React from 'react';
import { Card, Button, ListGroup, Row, Col, Image } from 'react-bootstrap';

export default function Cart({ cartItems, removeFromCart, updateQuantity }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2 className="mb-4">Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <h4 className="text-muted">Your cart is currently empty.</h4>
            <p>Start shopping to add items to your cart!</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="shadow-sm border-0 mb-4">
              <ListGroup variant="flush">
                {cartItems.map((item) => (
                  <ListGroup.Item key={item.id} className="p-3">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col xs={9} sm={4}>
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">Unit: ₦{item.price.toLocaleString()}</small>
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
                        <div className="fw-bold mb-2">₦{(item.price * item.quantity).toLocaleString()}</div>
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
          <Col md={4}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal</span>
                  <strong>₦{total.toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4 fs-5">
                  <strong>Total</strong>
                  <strong>₦{total.toLocaleString()}</strong>
                </div>
                <Button variant="primary" size="lg" className="w-100">
                  Proceed to Checkout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}
