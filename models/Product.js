const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  name: { type: mongoose.Schema.Types.String, required: true },
  description: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.Number, min: 0, max: Number.MAX_VALUE },
  image: { type: mongoose.Schema.Types.String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

let Product = mongoose.model('Product', productSchema)

module.exports = Product
