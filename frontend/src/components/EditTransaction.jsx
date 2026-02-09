import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { transactionAPI } from '../services/api';

const EditTransaction = ({ transaction, onComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      await transactionAPI.update(transaction.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      onComplete();
    } catch (err) {
      alert('Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <Row className="align-items-end g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small mb-1">Type</Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              size="sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small mb-1">Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              size="sm"
            />
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small mb-1">Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              size="sm"
            />
          </Form.Group>
        </Col>
        
        <Col md={3}>
          <Form.Group>
            <Form.Label className="small mb-1">Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              size="sm"
            />
          </Form.Group>
        </Col>
        
        <Col md={12} className="d-flex gap-2 justify-content-end">
          <Button 
            variant="success" 
            type="submit" 
            size="sm"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={onCancel}
            size="sm"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default EditTransaction;