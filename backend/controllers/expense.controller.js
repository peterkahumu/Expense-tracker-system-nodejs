const { response } = require('express');
const Expense = require('../models/expense.model');
const Income = require('../models/income.model'); 
const jwt = require('jsonwebtoken');


// Create a new expense
exports.createExpense = async (request, response) => {
    const { category, amount, transactionCost, paymentMethod } = request.body;
    const userId = request.userId;

    try {
        const expense = await Expense.create({ userId, category, amount, transactionCost, paymentMethod });
        response.status(201).json(expense);
    } catch (error) {
        console.error("Error creating expense: ", error);
        response.status(500).json({ error: "Unable to create expense. Please try again later." });
    }
};

// Get all expenses for the user
exports.getExpenses = async (request, response) => {
    const userId = request.userId;

    try {
        const expenses = await Expense.findAll({ where: { userId } });
        response.status(200).json(expenses);
    } catch (error) {
        response.status(500).json({ error: "Server Error When getting the Expenses." });
    }
};

// Update an existing expense
exports.updateExpense = async (request, response) => {
    const { id, category, amount, transactionCost, paymentMethod } = request.body;
    const userId = request.userId;

    try {
        const expense = await Expense.update({ category, amount, transactionCost, paymentMethod }, {
            where: { id, userId }
        });
        response.json(expense);
    } catch (error) {
        response.status(400).json({ error: "Unable to update the expense" });
    }
};

// Delete an expense
exports.deleteExpense = async (request, response) => {
    const { id } = request.body;
    const userId = request.userId;

    try {
        await Expense.destroy({ where: { id, userId } });
        response.sendStatus(204);
    } catch (error) {
        response.status(400).json({ error: "Unable to delete the expense" });
    }
};

// Add method to update income if needed
exports.updateIncome = async (request, response) => {
    const {newAmount } = request.body;
    const userId = request.userId;

    try{
        const[income, created] = await Income.findOrCreate({where: {userId}, defaults: {amount: newAmount}});

        if(!created){
            income.amount = newAmount;
            await income.save();
        }

        response.status(200).json("Income updated successfully.");

    } catch (error) {
        console.error("Error updating income: ", error);
        response.status(400).json({ error: "Unable to update the income" });
    }
}

// get the financial summary of the user (Total Expenses, Total Income, Balance.)
exports.getFinancialSummary = async (request, response) => {
    const userId = request.userId;

    try {
        const totalIncome = await Income.sum('amount', { where: { userId } });
        const totalAmount = await Expense.sum('amount', { where: { userId} });
        const totalTransactionCost = await Expense.sum('transactionCost', { where: { userId} });
        const totalExpenses = totalAmount + totalTransactionCost;

        const Balance = totalIncome - totalExpenses;

        response.status(200).json({
            totalIncome: totalIncome || 0, // if no income, return 0
            totalExpenses: totalExpenses || 0, // if no expenses, return 0
            availableBalance: Balance || 0
        });
    } catch (error) {
        console.error("Error getting financial summary: ", error);
        response.status(500).json({ error: "Unable to get the financial summary" });
    }
}

// update an existing expense.
exports.updateExpense = async (request, response) => {
    const {id } = request.params;
    const { amount, expenseCategory, transactionCost, paymentMethod} = request.body;

    try {
        const expense = await Expense.findOne({where: {id: id, userId: request.userId} }); 
        
        if(!expense) {
            return response.status(404).json({error: "Expense not found"});
        }

        expense.amount = amount;
        expense.transactionCost = transactionCost;
        expense.expenseCategory = expenseCategory;
        expense.paymentMethod = paymentMethod;

        await expense.save();

        response.status(200).json({message: "Expense updated successfully", expense});

    } catch (error) {
        console.error("Error updating expense: ", error);
        response.status(500).json({error: "Unable to update the expense"});
    }
}


// deleting an existing expense
exports.deleteExpense = async (request, response) => {
    const { id } = request.params;

    try {
        const expense = await Expense.findOne({where: {id: id, userId: request.userId} }); 
        
        if(!expense) {
            return response.status(404).json({error: "Expense not found"});
        }

        await expense.destroy();

        response.status(204).json({message: "Expense deleted successfully"});

    } catch (error) {
        console.error("Error deleting expense: ", error);
        response.status(500).json({error: "Unable to delete the expense"});
    }
}