var express = require("express");
var app = express();
const mongoose = require("mongoose");

//get seed data
var songs = require("./data/list-of-songs");
var songsSources = require("./data/songs-sources");

//get mongoose models
var Song = require("./data/song-model.js");
var Playlist = require("./data/playlist-model.js");
var Media = require("./data/media-model.js");

const databaseName = "genzwave";
const connectionString = "mongodb://localhost:27017/" + databaseName;

// set the view engine to ejs
app.set("view engine", "ejs");

// load static JavaScripts
app.use("/assets", express.static("./assets/"));

// enable express to pull json data from http body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/****************************************BEGIN: MongoDB**************************************/
/**
 * The following three functions are for database migration.
 */
async function initDb() {
  await mongoose.connect(connectionString);
  await addSongsToDb();
}

/**
 * Get and return a list of collection names
 * @returns A list of collection names
 */
async function getListOfCollections() {
  return await mongoose.connection.db
    .listCollections({}, { nameOnly: true })
    .toArray();
}

/**
 * Initialize database with songs.
 */
async function addSongsToDb() {
  const list = await getListOfCollections();
  const song = list.find((item) => item.name === "songs");
  const media = list.find((item) => item.name === "media");

  //Only add songs to database if
  if (song == undefined || song == null) {
    console.log("Adding songs to database");
    Song.insertMany(songs.songs);
  }

  if (media == undefined || media == null) {
    console.log("Adding media to database");
    Media.insertMany(songsSources.songsSources);
  }
}

/**
 * Find and return all songs in database.
 * @returns Array of songs
 */
async function getSongs() {
  const songs = (await Song.find()).map((song) => {
    return {
      songId: song.songId,
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
    };
  });

  return songs;
}

/**
 * Find and return all playlists in database.
 * @returns Array of playlists
 */
async function getPlaylists() {
  const playlists = (await Playlist.find()).map((playlist) => {
    return {
      playlistId: playlist.playlistId,
      title: playlist.title,
      timeSlot: playlist.timeSlot,
      displayTimeSlot: playlist.displayTimeSlot,
      songs: [...playlist.songs],
    };
  });

  return playlists;
}

/**
 * Find and return a playlist from given playlistId
 * @param {*} playlistId
 * @returns A playlist
 */
async function findPlaylist(playlistId) {
  return await Playlist.findOne({ playlistId: playlistId });
}

async function getMedia() {
  const media = (await Media.find()).map((m) => {
    return {
      url: m.url,
      alt: m.alt,
      src: m.src,
    };
  });

  return media;
}

initDb();
/****************************************END: MongoDB**************************************/

/****************************************BEGIN: Render**************************************/
// render index page
app.get("/", function (req, res) {
  res.render("pages/index", {
    currentProfile: "Home",
  });
});

// render dj profile page
app.get("/dj-profile", function (req, res) {
  const timeSlots = [
    {
      timeSlot: "5PM_TO_7PM",
      displayTimeSlot: "5pm - 7pm",
    },
    {
      timeSlot: "7PM_TO_9PM",
      displayTimeSlot: "7pm - 9pm",
    },
    {
      timeSlot: "9PM_TO_11PM",
      displayTimeSlot: "9pm - 11pm",
    },
    {
      timeSlot: "11PM_TO_1AM",
      displayTimeSlot: "11pm - 1am",
    },
  ];

  res.render("pages/dj-profile", {
    currentProfile: "My DJ Profile",
    currentPlaylists: timeSlots,
  });
});

// render producer profile page
app.get("/producer-profile", function (req, res) {
  res.render("pages/producer-profile", {
    currentProfile: "My Producer Profile",
  });
});

// render listener profile page
app.get("/listener-profile", function (req, res) {
  res.render("pages/listener-profile", {
    currentProfile: "My Listener Profile",
  });
});
/****************************************END: Render**************************************/

/****************************************BEGIN: api**************************************/
// return all current playlists.
app.get("/api/current-playlists", async function (req, res) {
  res.json(await getPlaylists());
});

// return a playlist by time slot.
app.get("/api/current-playlists/:timeSlot", async function (req, res) {
  const timeSlot = req.params.timeSlot.trim().toUpperCase();
  var playlist = (await getPlaylists()).filter(
    (x) => x.timeSlot === timeSlot
  )[0];

  res.json(playlist);
});

// return all previous playlists or filter by id, title.
app.get("/api/previous-playlists", async function (req, res) {
  if (Object.keys(req.query).length === 0) {
    res.json(await getPlaylists());
  } else {
    if (req.query.title != undefined) {
      res.json(
        (await getPlaylists()).filter((playlist) =>
          playlist.title.toLowerCase().includes(req.query.title.toLowerCase())
        )
      );
    } else if (req.query.id != undefined) {
      res.json(
        (await getPlaylists()).filter(
          (playlist) => playlist.playlistId === Number(req.query.id)
        )
      );
    }
  }
});

// return all songs.
app.get("/api/songs", async function (req, res) {
  if (Object.keys(req.query).length === 0) {
    res.json(await getSongs());
  } else {
    if (req.query.title != undefined) {
      res.json(
        (await getSongs()).filter((song) =>
          song.title.toLowerCase().includes(req.query.title.toLowerCase())
        )
      );
    } else if (req.query.id != undefined) {
      res.json(
        (await getSongs()).filter(
          (song) => song.songId === Number(req.query.id)
        )
      );
    }
  }
});

// receive data, update playlist, then return the updated playlist.
app.post("/api/current-playlists", async function (req, res) {
  //update existing playlist
  if (req.body.playlistId != 0) {
    var foundPlaylist = await findPlaylist(req.body.playlistId);
    var selectedSongs = (await getSongs()).filter((song) =>
      req.body.songsId.includes(song.songId)
    );

    foundPlaylist.title = req.body.playlistName;
    foundPlaylist.lastUpdate = new Date();
    foundPlaylist.songs = selectedSongs;
    foundPlaylist.save();

    res.json(foundPlaylist);

    //add new playlist
  } else {
    var nextId = Number(
      Math.max.apply(
        Math,
        (await getPlaylists()).map((x) => {
          return x.playlistId;
        })
      )
    );
    nextId = isFinite(nextId) ? ++nextId : (nextId = 1);

    var selectedSongs = (await getSongs()).filter((song) =>
      req.body.songsId.includes(song.songId)
    );

    const newPlaylist = new Playlist({
      playlistId: nextId++,
      title: req.body.playlistName,
      timeSlot: req.body.timeSlot,
      songs: [...selectedSongs],
    });

    await newPlaylist.save();

    res.json(newPlaylist);
  }
});

// return all songs image and audio media links.
app.get("/api/songs-media", async function (req, res) {
  res.json(await getMedia());
});
/****************************************END: api**************************************/

app.listen(8080);
console.log("Server is listening on port 8080");
