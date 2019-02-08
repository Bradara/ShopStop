const controllers = require('../controllers/index')
// const multer = require('multer')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/product/add', controllers.product.addGet)
  app.get('/category/add', controllers.category.addGet)
  app.get('/category/:category/products', controllers.category.productByCategory)
  app.get('/product/edit/:id', controllers.product.editGet)
  app.get('/product/delete/:id', controllers.product.deleteGet)
  app.get('/product/buy/:id', controllers.product.buyGet)
  app.get('/user/register', controllers.user.registerGet)
  app.get('/user/login', controllers.user.loginGet)

  app.post('/product/add', controllers.product.addPost)
  app.post('/category/add', controllers.category.addPost)
  app.post('/product/edit/:id', controllers.product.editPost)
  app.post('/product/delete/:id', controllers.product.deletePost)
  app.post('/user/register', controllers.user.registerPost)
  app.post('/user/login', controllers.user.loginPost)
  app.post('/user/logout', controllers.user.logout)
}
