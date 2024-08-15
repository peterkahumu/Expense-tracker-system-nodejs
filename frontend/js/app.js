document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const incomeForm = document.getElementById('incomeForm');
    const expenseForm = document.getElementById('expenseForm');

    // Check if the user is logged in and fetch data if so
    if (localStorage.getItem('token')) {
        fetchExpenses();
        fetchSummary();
    }

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        alert('Login successful');
                        window.location.href = '/api/expenses/dashboard';
                    } else {
                        alert("Token not set. Please try again later.");
                    }
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Handle registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('registerName').value;
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fullname, username, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful. You can now log in.');
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Handle income submission
    if (incomeForm) {
        incomeForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const newAmount = parseFloat(document.getElementById('newAmount').value);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/expenses/income', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newAmount }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Income added successfully');
                    fetchExpenses();
                    fetchSummary();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });
    }

    // Handle expense submission
    if (expenseForm) {
        expenseForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const category = document.getElementById("expenseCategory").value;
            const amount = document.getElementById("expenseAmount").value;
            const transactionCost = document.getElementById("transactionCost").value;
            const paymentMethod = document.getElementById("paymentMethod").value;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/expenses', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ category, amount, transactionCost, paymentMethod }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Expense added successfully');
                    fetchExpenses();
                    fetchSummary();
                } else {
                    alert(data.error);
                }
            } catch (error) {
                console.error("Error: ", error);
            }
        });
    }

    // Fetch and display expenses
    async function fetchExpenses() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/expenses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            const expenses = await response.json();
            const expenseList = document.querySelector('tbody');
            expenseList.innerHTML = expenses.map(expense =>
                `
                <tr>
                    <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount}</td>
                    <td>${expense.transactionCost}</td>
                    <td>${expense.paymentMethod}</td>
                    <td>${(parseFloat(expense.amount) + parseFloat(expense.transactionCost)).toFixed(2)}</td>
                    <td>                        
                        <button class="btn btn-danger delete-btn" data-id="${expense.id}">Delete</button>
                    </td>
                </tr>
                `
            ).join('');

            attachEventListeners();

        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Fetch and display summary
    async function fetchSummary() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/expenses/summary', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('totalIncome').textContent = data.totalIncome.toFixed(2);
                document.getElementById('totalExpenses').textContent = data.totalExpenses.toFixed(2);
                document.getElementById('availableAmount').textContent = data.availableBalance.toFixed(2);

                if (data.availableBalance < 0) {
                    document.getElementById('availableAmount').style.color = 'red';
                }
            } else {
                console.error("Failed to fetch summary:", error);
            }
        } catch (error) {
            console.error("Server Error:", error);
        }
    }
    
    // Handle delete button click using an event listener.
    // The event listener is added to the document and listens for a click event.
    async function handleDelete(event) {
        const expenseId = event.target.getAttribute('data-id');

        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                const response = await fetch(`/api/expenses/delete/${expenseId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    // remove the deleted expense reload the page.
                    alert('Expense deleted successfully');
                    fetchExpenses();
                    fetchSummary();
                } else {
                    alert("Failed to delete the expense.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Server error while updating the expense.");
            }
        }
    }

    // function to add event listeners to the buttons.
    function attachEventListeners() {
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }
});
