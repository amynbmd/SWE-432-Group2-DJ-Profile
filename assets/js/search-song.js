window.addEventListener('DOMContentLoaded', (event) => {
  var searchSong = document.getElementById('search-song');
  var songDropDown = document.getElementById('song-dropdown');

  //Display the list of searched song when user click IN the Search songs input box.
  searchSong.addEventListener('focus', function (event) {
    songDropDown.style.display = 'block';
  });

  //Hide the list of searched song when user click OUT of the Search songs input box.
  searchSong.addEventListener('focusout', function (event) {
    // Add short delay so that 'a.song-dropdown-item' have enough time to trigger.
    setTimeout(function () {
      songDropDown.style.display = 'none';
    }, 200);
  });

  //Everytime user type into Search songs, find songs that have the matching text.
  searchSong.addEventListener('keyup', async function () {
    var searchedValue = searchSong.value.trim();

    //If entered text is NOT empty then try to display fitlered list
    if (searchedValue !== '') {
      const url = window.location.origin + '/api/songs?title=' + searchedValue.toLowerCase();
      const response = await fetch(url);
      const matchedSongs = await response.json();
      
      //Create an <a> tag for each song to display.
      var matchedSongsToDisplay = matchedSongs.map((song) => {
        return `<a data-id='${song.songId}' class='song-dropdown-item'>${song.title} by ${song.artist}</a>`;
      });

      //Join all elements in the array in a single string and then display to HTML.
      songDropDown.innerHTML = matchedSongsToDisplay.join(' ');
    } else {
      //Clear searched list of entered text is empty.
      songDropDown.innerHTML = '';
    }
  });

  //When user clicked on the searched song, get the song id and pass it to the addSongToPlaylist() function
  songDropDown.addEventListener('click', async function (e) {
    if (e.target && e.target.matches('a.song-dropdown-item')) {
      const url = window.location.origin + '/api/songs?id=' + e.target.dataset.id;
      const response = await fetch(url);
      const foundSong = await response.json();    

      addSongToPlaylist(foundSong[0]);
    }
  });
});
