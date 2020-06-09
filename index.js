// Require needed packages
require('dotenv').config()
let cors = require('cors')
let express = require('express')
let expressJWT = require('express-jwt') // Validates tokens
let morgan = require('morgan')
let rowdyLogger = require('rowdy-logger')

// Instantiate app
let app = express()
let rowdyResults = rowdyLogger.begin(app)

// Set up middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false })) // Accept form data
app.use(express.json()) // Accept data from fetch (or any AJAX call)
app.use(cors()) // TODO: Add react app as origin to CORS

// Routes
app.use('/auth', require('./controllers/auth'))
app.use('/profile', expressJWT({secret: process.env.JWT_SECRET}), require('./controllers/profile'))
app.use('/recipe', expressJWT({secret: process.env.JWT_SECRET}), require('./controllers/recipe'))
app.use('/family', expressJWT({secret: process.env.JWT_SECRET}), require('./controllers/family'))

app.get('/', (req, res) => {
  res.send({ message: "Welcome to the base route for Tasty Roots!"})
})

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' })
})

app.listen(process.env.PORT || 3000, () => {
  rowdyResults.print()
})
