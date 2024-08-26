# Backend Project

## Overview

This project is a backend application for managing expenses and income. It uses Node.js with Express, Sequelize for ORM, and MySQL as the database. The application allows users to register, login, and manage their expenses and income.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MySQL](https://www.mysql.com/) (v8.x or higher)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/peterkahumu/Expense-tracker-system-nodejs.git
   cd <repository-directory>
   ```

2. **Set Up the Database**

   Open your MySQL client and execute the following SQL commands to create the database and tables:

   ```sql
   -- Create the database
   CREATE DATABASE IF NOT EXISTS my_expenses;

   -- Switch to the newly created database
   USE my_expenses;

   -- Create the Users table
   CREATE TABLE Users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       fullname VARCHAR(255) NOT NULL,
       username VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   );

   -- Create the Expenses table
   CREATE TABLE Expenses (
       id INT AUTO_INCREMENT PRIMARY KEY,
       userId INT NOT NULL,
       description VARCHAR(255) NOT NULL,
       category VARCHAR(50) NOT NULL,
       amount DECIMAL(10, 2) NOT NULL,
       transactionCost DECIMAL(10, 2) NOT NULL,
       paymentMethod VARCHAR(50) NOT NULL,
       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
   );

   -- Create the Income table
   CREATE TABLE Income (
       id INT AUTO_INCREMENT PRIMARY KEY,
       userId INT NOT NULL,
       amount DECIMAL(10, 2) NOT NULL,
       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
   );
   ```

3. **Configure the Database Connection**

   Open the `backend/config/db.js` file and update it with your database credentials. The configuration should look like this:

   ```javascript
   const { Sequelize } = require('sequelize');

   const sequelize = new Sequelize('my_expenses', 'username', 'password', {
     host: 'localhost',
     dialect: 'mysql',
     logging: false,
   });

   module.exports = sequelize;
   ```

   Replace `'username'` and `'password'` with your MySQL username and password.

4. **Install Dependencies**

   Navigate to the `backend` directory and run:

   ```bash
   cd backend
   npm install
   ```

5. **Start the Server**

   Use `npm start` or `node server.js` to start the server:

   ```bash
   npm start
   ```

   Alternatively:

   ```bash
   node server.js
   ```

6. **Access the System**

   Open your web browser and go to `http://localhost:5000`.

## Routes

- **Register:** `api/users/register`
- **Login:** `api/users/login`
- **Dashboard:** `api/expenses/dashboard`

Additional routes are defined in the following files:

- `backend/routes/expenses.routes.js`
- `backend/routes/users.routes.js`

## Development

- **Start the Development Server**

  The project uses `nodemon` for automatic restarts. You can start the development server with:

  ```bash
  npm start
  ```

- **Run Tests**

  If tests are defined, you can run them using:

  ```bash
  npm test
  ```

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues or pull requests if you want to contribute to the project. For significant changes, please open an issue first to discuss what you would like to change.

## Contact

For any questions, please contact the project maintainer at [muhumukip@gmail.com](mailto:muhumukip@gmail.com).
```
