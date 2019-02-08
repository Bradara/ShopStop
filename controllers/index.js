const homeHandler = require('./home')
const productsHandler = require('./product')
const categoryHandler = require('./category')
const userController = require('./user')

module.exports = {
  home: homeHandler,
  product: productsHandler,
  category: categoryHandler,
  user: userController
}
