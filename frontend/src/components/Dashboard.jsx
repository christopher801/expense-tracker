import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { transactionAPI } from '../services/api';
import TransactionList from './TransactionList';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      setTransactions(response.data.transactions);
      setSummary(response.data.summary);
      setError('');
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchTransactions();
      } catch (err) {
        alert('Failed to delete transaction');
      }
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your transactions...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="summary-card bg-success bg-opacity-10 border-success">
            <Card.Body className="text-center">
              <Card.Title>Total Income</Card.Title>
              <Card.Text className="display-6 income-amount">
                ${summary.totalIncome.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="summary-card bg-danger bg-opacity-10 border-danger">
            <Card.Body className="text-center">
              <Card.Title>Total Expense</Card.Title>
              <Card.Text className="display-6 expense-amount">
                ${summary.totalExpense.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className={`summary-card ${
            summary.balance >= 0 
              ? 'bg-primary bg-opacity-10 border-primary' 
              : 'bg-warning bg-opacity-10 border-warning'
          }`}>
            <Card.Body className="text-center">
              <Card.Title>Balance</Card.Title>
              <Card.Text className={`display-6 ${
                summary.balance >= 0 ? 'text-primary' : 'text-warning'
              }`}>
                ${summary.balance.toFixed(2)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Transaction List */}
      <Card>
        <Card.Body>
          <Card.Title>Recent Transactions</Card.Title>
          <TransactionList 
            transactions={transactions} 
            onDelete={handleDelete}
            onUpdate={() => fetchTransactions()}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;