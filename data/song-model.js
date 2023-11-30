var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
    songId: Number,
    title: String,
    artist: String,
    album: String,
    year: String,
});

module.exports = mongoose.model('songs', songSchema); 