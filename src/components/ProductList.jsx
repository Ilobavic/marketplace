import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

export default function ProductList({ products, addToCart }) {
  return (
    <div className="product-list-container">
      <h2 className="mb-4 text-center">Featured Collection</h2>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {products.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm border-0 product-card-hover">
              <div className="card-img-wrapper" style={{ height: '250px', overflow: 'hidden' }}>
                <Card.Img 
                  variant="top" 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fs-6 fw-bold text-truncate">{product.name}</Card.Title>
                <Card.Text className="text-primary fw-bold fs-5">
                  ₦{product.price.toLocaleString()}
                </Card.Text>
                <div className="mt-auto">
                  <Button 
                    variant="outline-dark" 
                    className="w-100 rounded-pill"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
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
