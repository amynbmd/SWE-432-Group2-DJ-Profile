var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mediaSchema = new Schema({
    url: String,
    alt: String,
    src: String,
});

module.exports = mongoose.model('media', mediaSchema); 