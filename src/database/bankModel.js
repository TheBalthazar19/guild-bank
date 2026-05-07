const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  data: {
    type: Object,
    default: {}
  }
});

module.exports = mongoose.model('Bank', bankSchema);