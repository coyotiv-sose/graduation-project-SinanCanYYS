const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
require('dotenv').config()
require('./database-connection')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const ordersRouter = require('./routes/orders')
const restaurantsRouter = require('./routes/restaurants')
const menuItemsRouter = require('./routes/menu-items')
const ingredientsRouter = require('./routes/ingredients')

const User = require('./models/user')
const Restaurant = require('./models/restaurant')
const MenuItem = require('./models/menu')
const Order = require('./models/order')
const Ingredient = require('./models/ingredient')
const OrderElement = require('./models/order-element')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/orders', ordersRouter)
app.use('/restaurants', restaurantsRouter)
app.use('/menu-items', menuItemsRouter)
app.use('/ingredients', ingredientsRouter)
app.get('/delete', async (req, res) => {
  await User.deleteMany()
  await Restaurant.deleteMany()
  await MenuItem.deleteMany()
  await Order.deleteMany()
  await Ingredient.deleteMany()
  await OrderElement.deleteMany()
  res.send('Deleted')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app