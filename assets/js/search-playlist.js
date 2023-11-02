window.addEventListener('DOMContentLoaded', (event) => {
  var searchPlaylist = document.getElementById('search-previous');
  var playlistDropDown = document.getElementById('playlist-dropdown');

  searchPlaylist.addEventListener('focus', function (event) {
    playlistDropDown.style.display = 'block';
  });

  searchPlaylist.addEventListener('focusout', function (event) {
    setTimeout(function () {
      playlistDropDown.style.display = 'none';
    }, 200);
  });

  //Everytime user type into Search songs, find songs that have the matching text.
  searchPlaylist.addEventListener('keyup', async function () {
    var searchedValue = searchPlaylist.value.trim();

    //If entered text is NOT empty then try to display fitlered list
    if (searchedValue !== '') {
      let url = window.location.origin + '/api/previous-playlists?title=' + searchedValue.toLowerCase();
      const response = await fetch(url);
      const playlists = await response.json();

      //Create an <a> tag for each song to display.
      var matchedPlaylistsToDisplay = playlists.map((playlist) => {
        return `<a data-id='${playlist.playlistId}' class='playlist-dropdown-item'>${playlist.title}</a>`;
      });

      //Join all elements in the array in a single string and then display to HTML.
      playlistDropDown.innerHTML = matchedPlaylistsToDisplay.join(' ');

    } else {
      //Clear searched list of entered text is empty.
      playlistDropDown.innerHTML = '';
    }
  });

  playlistDropDown.addEventListener('click', function (e) {
    if (e.target && e.target.matches('a.playlist-dropdown-item')) {
      addSongsFromPlaylist(e.target.dataset.id);
    }
  });

  /**
   * Get Songs from selected playlist and add to current playlist.
   * @param {*} playlistId
   */
  async function addSongsFromPlaylist(playlistId) {
    let url = window.location.origin + '/api/previous-playlists?id=' + playlistId;
    const response = await fetch(url);
    const playlists = await response.json();
    for (var index = 0; index < playlists[0].songs.length; index++) {
      addSongToPlaylist(playlists[0].songs[index]);
    }

    toggleAllActive();
  }
});
