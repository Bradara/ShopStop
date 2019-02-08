const Product = require('../models/Product')
const fs = require('fs')
const multiparty = require('multiparty')
const shortid = require('shortid')
const Category = require('../models/Category')
const Busboy = require('busboy')

function addGet (req, res) {
  Category.find().then(categories => {
    res.render('products/add.pug', { categories: categories })
  })
}

function addPost (req, res) {
  let product = {}

  let form = new multiparty.Form()

  form.on('part', (part) => {
    if (part.filename) {
      let extension = part.filename.split('.').pop()
      let datastring = ''

      part.setEncoding('binary')
      part.on('data', (data) => {
        datastring += data
      })
      part.on('end', () => {
        let fileName = shortid.generate()
        let filePath = 'content/images/uploadedImages/' + fileName + '.' + extension
        product.image = filePath
        fs.writeFile(`./${filePath}`, datastring, { encoding: 'ascii' }, err => {
          if (err) {
            console.log(err)
          }
        })
      })
    } else {
      part.setEncoding('utf-8')
      let field = ''
      part.on('data', data => {
        field += data
      })

      part.on('end', () => {
        product[part.name] = field
      })
    }
  })

  form.on('close', () => {
    product.creator = req.user._id
    Product.create(product).then((p) => {
      Category.findById(p.category).then(c => {
        c.products.push(p._id)
        c.save()
      })
      res.writeHead(302, {
        Location: '/'
      })
      res.end()
    }).catch(err => {
      console.log(err)
      res.render('/product/add', { error: err.message })
    })
  })

  form.parse(req)
}

function editGet (req, res) {
  let id = req.params.id
  Product.findById(id).then(p => {
    if (!p) {
      res.sendStatus(404)
      return
    }

    Category.find().then(categories => {
      res.render('products/edit', {
        product: p,
        categories: categories
      })
    })
  })
}

function editPost (req, res) {
  let id = req.params.id
  let editedProduct = {}
  let busboy = new Busboy({ headers: req.headers })

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    if (filename) {
      console.log(filename)
      let fileData
      let fileName = shortid.generate()
      let extension = filename.split('.').pop()
      let filePath = 'content/images/uploadedImages/' + fileName + '.' + extension
      file.on('data', (data) => {
        fileData += data
      })
      file.on('end', () => {
        fs.writeFile(filePath, fileData, { encoding: 'ascii' }, err => {
          if (err) {
            console.log(err)
          }
        })
      })
    } else {
      file.on('data', (data) => {
      })
      file.on('end', () => {
      })
    }
  })

  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    console.log(fieldname + ': ' + val)
    editedProduct[fieldname] = val
  })

  busboy.on('finish', () => {
    Product.findById(id).then(p => {
      if (!p) {
        res.redirect(`/?error=${encodeURIComponent('error=Product was not found!')}`)
        res.end()
        return
      }

      p.name = editedProduct.name
      p.description = editedProduct.description
      p.price = editedProduct.price
      if (p.category.toString() !== editedProduct.category) {
        Category.findById(p.category).then(currentCat => {
          Category.findById(editedProduct.category).then(newCat => {
            let index = currentCat.products.indexOf(p._id)
            if (index >= 0) {
              currentCat.products.splice(index, 1)
            }

            currentCat.save()

            newCat.products.push(p._id)
            newCat.save()

            p.category = editedProduct.category
            p.save().then(() => {
              res.redirect('/?success=' + encodeURIComponent('Product was edited successfully'))
              res.end()
            })
          })
        })
      } else {
        p.save().then(() => {
          res.redirect('/?success=' + encodeURIComponent('Product was edited successfully'))
          res.end()
        })
      }
    }
    )
  })

  req.pipe(busboy)
}

function deleteGet (req, res) {
  let id = req.params.id
  Product.findById(id).then(product => {
    if (!product) {
      res.redirect(301, '/?error="Product was not found!!!"')
    }

    res.render('products/delete', { product: product })
  })
}

function deletePost (req, res) {
  let id = req.params.id

  Product.findById(id).then(p => {
    if (!p) {
      res.redirect(301, '/?error="Product was not found!!!"')
    }

    Category.findById(p.category).then(c => {
      c.products.splice(c.products.indexOf(id), 1)
    })

    if (p.image) {
      let filePath = '' + p.image

      fs.unlink(filePath, err => {
        if (err) {
          console.log(err)
        }
      })
    }

    Product.deleteOne(p).then(() => {
      res.redirect('/?success=' + 'Product was deleted successfully!')
    }).catch(err => {
      console.log(err)
      res.redirect('/?error=' + encodeURIComponent(err))
    })
  })
}

function buyGet (req, res) {
  let id = req.params.id
  Product.findById(id).then(p => {
    res.render('products/buy', { product: p })
  })
}

module.exports = {
  addGet: addGet,
  addPost: addPost,
  editGet: editGet,
  editPost: editPost,
  deleteGet: deleteGet,
  deletePost: deletePost,
  buyGet: buyGet
}
