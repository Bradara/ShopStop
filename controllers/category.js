const Category = require('../models/Category')

function addGet (req, res) {
  res.render('category/add')
}

function addPost (req, res) {
  let category = req.body
  category.creator = req.user._id

  Category.create(category).then(() => {
    req.redirect(302, `/?success="Category with name ${category.name} created!"`)
  }).catch(err => {
    console.log(err)
    res.redirect(302, `/?error=${err.message}`)
  })
}

function productByCategory (req, res) {
  let categoryName = req.params.category

  Category.findOne({ name: categoryName }).populate('products')
    .then(category => {
      if (!category) {
        res.sendStatus(404)
        return
      }

      res.render('category/products', { category: category })
    })
}

module.exports = {
  addGet: addGet,
  addPost: addPost,
  productByCategory: productByCategory
}
