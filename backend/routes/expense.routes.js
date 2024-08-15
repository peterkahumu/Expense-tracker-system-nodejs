const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const path = require('path');
const authenticateToken = require('../middleware/auth');
const { request } = require('http');

const app = express();

// serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Route to load the dashboard for the user to 
router.get('/dashboard', (request, response) => {
    response.sendFile(path.join(__dirname, '../../frontend/index.html'));
}) 

// Load the update expense form
router.get('/update', (request, response) => {
    response.sendFile(path.join(__dirname, '../../frontend/updateExpense.html'));
})


// Route to get all expenses
router.get('/', authenticateToken,expenseController.getExpenses);


// Route to get the expenses summary
router.get('/summary', authenticateToken,expenseController.getFinancialSummary);

// Route to add a new expense
router.post('/', authenticateToken ,expenseController.createExpense);

// Route to update income
router.post('/income', authenticateToken ,expenseController.updateIncome);

// Route to update an expense
router.put('/update/:id', authenticateToken, expenseController.updateExpense);

// Route to delete an expense
router.delete('/delete/:id', authenticateToken, expenseController.deleteExpense);

module.exports = router;
