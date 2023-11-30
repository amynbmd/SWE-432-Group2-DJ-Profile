var express = require("express");
const session = require("express-session");
var app = express();

const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

//get seed data
var songs = require("./data/list-of-songs");
var songsSources = require("./data/songs-sources");

//get mongoose models
var Song = require("./data/song-model.js");
var Playlist = require("./data/playlist-model.js");
var Media = require("./data/media-model.js");

var Schema = mongoose.Schema;

/*
  "name": "DJ Unusual Eustacia (A.K.A Lil. Duyen)",
  "timeslot": "evening",
  "genre": "pop",
  "emotion": "hype",
  "rhythm": "fast"
*/
var DJSchema = new Schema({
  name: String,
  timeslot: String,
  genre: String,
  emotion: String,
  rhythm: String,
});

var DJ = mongoose.model("djs", DJSchema);

const genDB = require("./assets/js/genDB");
const { genDj, genSong, genPlaylist } = genDB;

const databaseName = "genzwave";
const connectionString = "mongodb://localhost:27017/" + databaseName;
const client = new MongoClient(connectionString);

const prefs = {
  genre: ["rap", "pop", "rb"],
  emotion: ["hype", "sad", "romance"],
  rhythm: ["slow", "fast"],
};

// set the view engine to ejs
app.set("view engine", "ejs");

// load static JavaScripts
app.use("/assets", express.static("./assets/"));

// enable express to pull json data from http body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "keysecret",
    resave: false,
    saveUninitialized: true,
  })
);

/****************************************BEGIN: MongoDB**************************************/
/**
 *
 */
async function initDb() {
  await mongoose.connect(connectionString);
  await addSongsToDb();
  await runDB();
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
      dj: playlist.dj,
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

async function runDB() {
  try {
    await client.connect();
    console.log("connected");

    const list = await getListOfCollections();
    const djs = list.find((item) => item.name === "djs");
    const playlists = list.find((item) => item.name === "playlists");

    const dj_list = await getDjs();

    if (djs == undefined || djs == null || dj_list.length == 0) {
      const db = client.db(databaseName);
      // script for entering sample data in db
      const djInsertResult = await db
        .collection("djs")
        .insertMany(Array.from({ length: 60 }, genDj));
      const djIds = djInsertResult.insertedIds;
    }

    if (playlists == undefined || playlists == null) {
      const djIdArray = Object.values(djIds); // Extract the values from the object
      await Promise.all(
        djIdArray.map((djId) =>
          genPlaylist(djId, db).then((playlist) =>
            db.collection("playlists").insertOne(playlist)
          )
        )
      );
    }

    console.log("done");
  } catch (e) {
    console.log(e);
  }
}
// runDB();

/**
 * Find and return all playlists in database.
 * @returns Array of playlists
 */
async function getDjs() {
  await client.connect();
  const db = client.db(databaseName);

  const djs = (await DJ.find()).map((dj) => {
    return {
      id: dj._id.toString(),
      name: dj.name,
      timeslot: dj.timeslot,
      genre: dj.genre,
      emotion: dj.emotion,
      rhythm: dj.rhythm,
    };
  });

  return djs;
}

async function getDJData(prefData) {
  try {
    await client.connect();
    console.log("connected to db");
    const db = client.db(databaseName);
    // console.log(prefData)
    const query = { $and: [] };
    for (const categ in prefData) {
      // console.log({$or: prefData[categ]})
      const filter = { [categ]: { $in: prefData[categ] } };
      query["$and"].push(filter);
    }
    // console.log(query);
    const filteredDjs = db.collection("djs").find(query);
    // console.log(filteredDjs)
    const djData = [];
    for await (const dj of filteredDjs) {
      console.log(dj._id);
      console.log(dj._id.toString());
      console.log(dj);

      const playlists = await getPlaylists();
      const playlistObj = playlists.filter(
        (playlist) => playlist.dj == dj._id.toString()
      )[0];

      if (playlistObj) {
        // const songs = playlistObj.songs;
        // // console.log(songs);
        // const songNames = []
        // for (const ind in songs){
        //     songNames.push(ind.title);
        // }

        djData.push({
          name: dj.name,
          playlist: playlistObj.title,
          timeSlot: playlistObj.timeSlot,
        });
      }
    }
    console.log(djData.length);

    console.log("got dj data from db");

    return djData;
  } catch (e) {
    console.log(e);
  }
}

async function getUserData(name) {
  try {
    await client.connect();
    console.log("connected to db");
    const db = client.db(databaseName);

    const user = db.collection("users").find({ name: name });
    if (await user.hasNext()) {
      console.log("found user data");
      return user.next();
    }
    console.log("couldn't find user data");
    return false;
  } catch (e) {
    console.log(e);
  }
}

async function initUserData(name) {
  try {
    await client.connect();
    console.log("connected to db");
    const db = client.db(databaseName);

    const insertResult = db.collection("users").insertOne({
      name: name,
      prefData: "",
      lastPlayedDj: "",
    });
    console.log("created db user data");
    return await insertResult;
  } catch (e) {
    console.log(e);
  }
}

async function updatePrefData(name, prefData) {
  try {
    await client.connect();
    console.log("connected to db");
    const db = client.db(databaseName);

    const res = await db
      .collection("users")
      .updateOne({ name: name }, { $set: { prefData: prefData } });
    // console.log(res);
    console.log("updated db pref data");
  } catch (e) {
    console.log(e);
  }
}

async function updateListeningData(name, lastPlayedDj) {
  try {
    await client.connect();
    console.log("connected to db");
    const db = client.db(databaseName);

    const res = await db
      .collection("users")
      .updateOne({ name: name }, { $set: { lastPlayedDj: lastPlayedDj } });
    // console.log(res);
    console.log("updated db lastplayeddj data");
  } catch (e) {
    console.log(e);
  }
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

////////////////////////////////////////DJ////////////////////////////////////////
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

    var obj = {
      playlistId: foundPlaylist.playlistId,
      title: foundPlaylist.title,
      timeSlot: foundPlaylist.timeSlot,
      displayTimeSlot: foundPlaylist.displayTimeSlot,
      songs: [...foundPlaylist.songs],
      dj: foundPlaylist.dj,
    };

    obj.message = "Playlist updated successfully!";

    res.json(obj);

    //add new playlist
  } else {
    const djs = await getDjs();
    const dj = djs[Math.floor(Math.random() * djs.length)];

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
      dj: dj.id.toString(),
    });

    await newPlaylist.save();

    var obj = {
      playlistId: newPlaylist.playlistId,
      title: newPlaylist.title,
      timeSlot: newPlaylist.timeSlot,
      displayTimeSlot: newPlaylist.displayTimeSlot,
      songs: [...newPlaylist.songs],
      dj: newPlaylist.dj,
    };
    obj.message = "Playlist created successfully!";

    res.json(obj);
  }
});

// return all songs image and audio media links.
app.get("/api/songs-media", async function (req, res) {
  res.json(await getMedia());
});
////////////////////////////////////////DJ////////////////////////////////////////

////////////////////////////////////////listener////////////////////////////////////////

// render listener profile page
app.get("/listener-profile", function (req, res) {
  res.render("pages/key.ejs", {
    username: "",
    currentProfile: "My Listener Profile",
  });
});

app.post("/key", async (req, res) => {
  const username = req.body.username;
  const data = await getUserData(username);
  req.session.username = username;
  if (data) {
    // console.log(data)
    if (!data.prefData) {
      res.redirect("/pref");
      return;
    }
    res.redirect("/player");
    return;
  }
  const insertRes = await initUserData(username);
  req.session.userId = "" + insertRes.insertedId;
  res.redirect("/pref");
});

app.get("/pref", (req, res) => {
  const username = req.session.username;
  res.render("pages/prefs.ejs", {
    username: username,
    currentProfile: "My Listener Profile",
  });
});

app.post("/pref/record/:prefData", async (req, res) => {
  const prefData = req.params.prefData;
  // console.log("pref data in /pref/rec0rd", prefData)
  const parsedData = JSON.parse(prefData);
  await updatePrefData(req.session.username, parsedData);
});

app.get("/player", async (req, res) => {
  const userData = await getUserData(req.session.username);
  const prefData = userData.prefData;
  const lastPlayedDj = userData.lastPlayedDj;
  // console.log('on player get')
  console.log("in /player", lastPlayedDj);
  // const parsedData = JSON.parse(prefData);
  const djData = await getDJData(prefData);

  res.render("pages/player.ejs", {
    djData: djData,
    lastPlayedDj: lastPlayedDj,
    username: req.session.username,
    currentProfile: "My Listener Profile",
  });
});
////////////////////////////////////////listener////////////////////////////////////////
/****************************************END: api**************************************/

app.listen(8080);
console.log("Server is listening on port 8080");
