var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
  description: { //annotations of what the thing is 
    type: String,
    required: 'Item Description'
  }
});

module.exports = mongoose.model('Items', ItemSchema);