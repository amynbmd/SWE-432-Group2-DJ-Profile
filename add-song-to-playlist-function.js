/**
   * Using the song id, search the song, and add song to playlist
   * @param {*} songId  Example: {
      songId: 1,
      title: 'Like a Rolling Stone',
      artist: 'Bob Dylan',
      album: 'Highway 61 Revisited',
      year: '1965',
    }
   */
function addSongToPlaylist(song) {
  var songsContainer = document.getElementById('songs-container');

  //Clone the template element so that we can insert using the selected song properies.
  var templateElement = document.getElementById('hidden-template-element').cloneNode(true);

  //Remove the template attributes
  templateElement.removeAttribute('id');
  templateElement.removeAttribute('style');

  //TO-DO: replace the image and audio source with selected song.
  //This is only to get a random element in the array.
  var randomSongProperties = SONGS_SOURCE[Math.floor(Math.random() * SONGS_SOURCE.length)];

  templateElement.querySelector('.song-name').innerHTML = song.title + ' by ' + song.artist;
  templateElement.querySelector('img').alt = randomSongProperties.alt;
  templateElement.querySelector('img').src = randomSongProperties.url;
  templateElement.querySelector('source').src = randomSongProperties.src;
  templateElement.querySelector("input[type='checkbox']").dataset.songid = song.songId;

  songsContainer.append(templateElement);
}


/**
 * 
 * @param {*} songs array of songs
 */
function addSongsToPlaylist(songs) {
  var songsContainer = document.getElementById('songs-container');
  songsContainer.innerHTML = "";

  for (var index = 0; index < songs.length; index++) {
    addSongToPlaylist(songs[index]);
  }

  toggleAllActive();
}

/**
 * Toggle all songs to active in the id='songs-container'
 */
function toggleAllActive() {
  var nodes = document.getElementById('songs-container').querySelectorAll("input[type='checkbox']");

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].checked = true;
  }
}