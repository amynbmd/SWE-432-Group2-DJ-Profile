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
async function addSongToPlaylist(song, toggleAll) {
  var songsContainer = document.getElementById('songs-container');

  //Clone the template element so that we can insert using the selected song properies.
  var templateElement = document.getElementById('hidden-template-element').cloneNode(true);

  //Remove the template attributes
  templateElement.removeAttribute('id');
  templateElement.removeAttribute('style');

  //TO-DO: replace the image and audio source with selected song.
  //This is only to get a random element in the array.


  const url = window.location.origin + '/api/songs-media';
  const response = await fetch(url);
  const songsSources = await response.json();
  var randomSongProperties = songsSources[Math.floor(Math.random() * songsSources.length)];

  templateElement.querySelector('.song-name').innerHTML = song.title + ' by ' + song.artist;
  templateElement.querySelector('img').alt = randomSongProperties.alt;
  templateElement.querySelector('img').src = randomSongProperties.url;
  templateElement.querySelector('source').src = randomSongProperties.src;
  templateElement.querySelector("input[type='checkbox']").dataset.songid = song.songId;

  songsContainer.append(templateElement);


  if (toggleAll) {
    toggleAllActive()
  }
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
}

/**
 * Toggle all songs to active in the id='songs-container'
 */
async function toggleAllActive() {
  var nodes = document.getElementById('songs-container').querySelectorAll("input[type='checkbox']");
  for (var i = 0; i < nodes.length; i++) {
    nodes[i].checked = true;
  }
}