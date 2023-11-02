var express = require('express');
var app = express();

// get seed data
var currentPlaylists = require("./data/current-playlists");
var previousPlaylists = require("./data/previous-playlists");
var songs = require("./data/list-of-songs");
var songsSources = require("./data/songs-sources");


// set the view engine to ejs
app.set('view engine', 'ejs');

// load static JavaScripts
app.use('/assets', express.static('./assets/'));

// enable express to pull json data from http body.
app.use(express.urlencoded({extended: true}));
app.use(express.json());


/****************************************BEGIN: Render**************************************/
// render index page
app.get('/', function (req, res) {
  res.render('pages/index', {
    currentProfile: 'Home',
  });
});

// render dj profile page
app.get('/dj-profile', function (req, res) {
  res.render('pages/dj-profile', {
    currentProfile: 'My DJ Profile',
    currentPlaylists: currentPlaylists.playlists
  });
});

// render producer profile page
app.get('/producer-profile', function (req, res) {
  res.render('pages/producer-profile', {
    currentProfile: 'My Producer Profile',
  });
});

// render listener profile page
app.get('/listener-profile', function (req, res) {
  res.render('pages/listener-profile', {
    currentProfile: 'My Listener Profile',
  });
});
/****************************************END: Render**************************************/


/****************************************BEGIN: api**************************************/
// return all current playlists.
app.get('/api/current-playlists', function (req, res) {
  res.json(currentPlaylists.playlists)
});

// return a playlist by time slot.
app.get('/api/current-playlists/:timeSlot', function (req, res) {
  const timeSlot = req.params.timeSlot.trim().toUpperCase();
  var playlist = currentPlaylists.playlists.filter(x => x.timeSlot === timeSlot)[0];

  if (playlist == undefined) {
    res.json({})
  }

  res.json(playlist)
});


// return all previous playlists or filter by id, title.
app.get('/api/previous-playlists', function (req, res) {
  if (Object.keys(req.query).length === 0) {
    res.json(previousPlaylists.playlists)
  } else {
    
    if (req.query.title != undefined) {
      res.json(previousPlaylists.playlists.filter((playlist) => playlist.title.toLowerCase().includes(req.query.title.toLowerCase())));
    } else if (req.query.id != undefined) {
      res.json(previousPlaylists.playlists.filter(playlist => playlist.playlistId === Number(req.query.id)));
    }
  }
});


// return all songs.
app.get('/api/songs', function (req, res) {
  if (Object.keys(req.query).length === 0) {
    res.json(songs.songs)
  } else {
    
    if (req.query.title != undefined) {
      res.json(songs.songs.filter((song) => song.title.toLowerCase().includes(req.query.title.toLowerCase())));
    } else if (req.query.id != undefined) {
      res.json(songs.songs.filter(song => song.songId === Number(req.query.id)));
    }
  }
});


// receive data, update playlist, then return the updated playlist.
app.post('/api/current-playlists', function (req, res) {
  var foundPlaylist = currentPlaylists.playlists.find((playlist) => playlist.playlistId == req.body.playlistId);
  var selectedSongs = songs.songs.filter(song => req.body.songsId.includes(song.songId));

  foundPlaylist.songs = selectedSongs;
  foundPlaylist.title = req.body.playlistName;
  foundPlaylist.lastUpdate = new Date();
  foundPlaylist.songs = selectedSongs;

  res.json(foundPlaylist)
});


// return all songs image and audio media links.
app.get('/api/songs-media', function (req, res) {
  res.json(songsSources.songsSources)
});
/****************************************END: api**************************************/


app.listen(8080);
console.log('Server is listening on port');