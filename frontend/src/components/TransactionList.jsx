import { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import EditTransaction from './EditTransaction';

const TransactionList = ({ transactions, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditComplete = () => {
    setEditingId(null);
    onUpdate();
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No transactions found. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <Table hover className="align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th className="text-end">Amount</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="transaction-item">
              <td>{formatDate(transaction.date)}</td>
              <td>
                <Badge bg={transaction.type === 'income' ? 'success' : 'danger'}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              </td>
              <td>{transaction.description || '-'}</td>
              <td className={`text-end ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}`}>
                ${parseFloat(transaction.amount).toFixed(2)}
              </td>
              <td className="text-center">
                {editingId === transaction.id ? (
                  <EditTransaction 
                    transaction={transaction} 
                    onComplete={handleEditComplete}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      className="btn-action"
                      onClick={() => setEditingId(transaction.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      className="btn-action"
                      onClick={() => onDelete(transaction.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TransactionList;