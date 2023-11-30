var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    playlistId: Number,
    title: String,
    timeSlot: String,
    songs: [{
        songId: Number,
        title: String,
        artist: String,
        album: String,
        year: String,
    }],
    prefData: {},
    dj: String
});

module.exports = mongoose.model('playlists', playlistSchema); 