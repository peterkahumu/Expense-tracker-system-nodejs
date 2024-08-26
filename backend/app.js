const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/user.routes')
const expenseRoutes = require('./routes/expense.routes')
const sequelize = require('./config/db.config')
const path = require('path')

const app = express()

app.use(cors())
app.use(cors({
   origin: 'http://localhost:5000',
   allowedHeaders: ['Authorization', 'Content-Type'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// serve the static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')))

// API ROUTES
app.use('/api/users', userRoutes)
app.use('/api/expenses', expenseRoutes)


// Serve the HTML pages for specific routes
app.get('/api/users/login', (request, response) => {
   response.sendFile(path.join(__dirname, '../frontend/login.html'))
})

app.get('/api/users/register', (request, response) => {
   response.sendFile(path.join(__dirname, '../frontend/register.html'))
})

app.get('/api/expenses', (request, response) => {
   response.sendFile(path.join(__dirname, '../frontend/index.html'))
})

sequelize.authenticate()
   .then(() => {
      console.log('Database connection has been established successfully')
   })
   .catch(error => {
      console.log("Unable to connect to the database.", error)
   })

sequelize.sync().then(() => {
   console.log('Database Synchronized.')
}).catch(error => {
   console.log("Unable to synchronize the database: ", error)
})

module.exports = app;