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
  searchPlaylist.addEventListener('keyup', function () {
    var searchedValue = searchPlaylist.value.trim();

    //If entered text is NOT empty then try to display fitlered list
    if (searchedValue !== '') {
      //Find all matched songs.
      var matchedPlaylist = LIST_OF_PREVIOUS_PLAYLIST.filter((playlist) => playlist.title.toLowerCase().includes(searchedValue.toLowerCase()));

      //Create an <a> tag for each song to display.
      var matchedPlaylistsToDisplay = matchedPlaylist.map((playlist) => {
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
  function addSongsFromPlaylist(playlistId) {
    var foundPlaylist = LIST_OF_PREVIOUS_PLAYLIST.find((playlist) => playlist.playlistId == playlistId);
    for (var index = 0; index < foundPlaylist.songs.length; index++) {
        addSongToPlaylist(foundPlaylist.songs[index]);
    }

    toggleAllActive();
  }
});
