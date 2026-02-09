const pool = require('../config/db');

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const [transactions] = await pool.execute(
      `SELECT id, type, amount, description, date, created_at 
       FROM transactions 
       WHERE user_id = ? 
       ORDER BY date DESC, created_at DESC`,
      [req.user.id]
    );

    // Calculate summary
    const [summary] = await pool.execute(
      `SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense
       FROM transactions 
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({
      transactions,
      summary: {
        totalIncome: parseFloat(summary[0].totalIncome || 0),
        totalExpense: parseFloat(summary[0].totalExpense || 0),
        balance: parseFloat(summary[0].totalIncome || 0) - parseFloat(summary[0].totalExpense || 0)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { type, amount, description, date } = req.body;

    // Validate transaction type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }

    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, type, amount, description || '', date || new Date().toISOString().split('T')[0]]
    );

    const [newTransaction] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, description, date } = req.body;

    // Check if transaction exists and belongs to user
    const [transactions] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate transaction type if provided
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' });
    }

    await pool.execute(
      `UPDATE transactions 
       SET type = COALESCE(?, type), 
           amount = COALESCE(?, amount), 
           description = COALESCE(?, description), 
           date = COALESCE(?, date) 
       WHERE id = ? AND user_id = ?`,
      [type, amount, description, date, id, req.user.id]
    );

    const [updatedTransaction] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ?',
      [id]
    );

    res.json(updatedTransaction[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const [transactions] = await pool.execute(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await pool.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction
};