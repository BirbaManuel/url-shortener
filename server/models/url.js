const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UrlSchema = new Schema({
  short: { type: String, required: true, unique: true },
  enhanced: { type: String, required: true, unique: true },
})

// Url.methods.getInfo = function() {
//   return this.short + ' ' + this.enhanced
// }

module.exports = mongoose.model('Url', UrlSchema)
