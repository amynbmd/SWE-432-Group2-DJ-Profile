/* Function to validate the form */
function validateForm() {
  var playlistName = document.getElementById("playlist-name");

  if (playlistName.value.trim() === "") {
    alert("Please enter the name of the playlist.");
    playlistName.focus();
    return false;
  }

  return true;
}


function processForm(form) {
  var playlistName = document.getElementById('playlist-name').value;
  var playlistId = document.getElementById('playlist-id').value;
  var foundPlaylist = LIST_OF_CURRENT_PLAYLIST.find((playlist) => playlist.playlistId == playlistId);

  var activeSongs = [...form.querySelectorAll('input[name=song-toggle]:checked')];
  var songsId = activeSongs.map(song => {
    return Number(song.dataset.songid);
  });

  var selectedSongs = LIST_OF_TEST_SONGS.filter(song => songsId.includes(song.songId));
  foundPlaylist.songs = selectedSongs;
  foundPlaylist.title = playlistName;
  foundPlaylist.lastUpdate = new Date();

  addSongsToPlaylist(foundPlaylist.songs);

  console.log(foundPlaylist);

  // console.log(selectedSongs);
  // console.log(songsId);
  // console.log(playlistId, playlistName);
  // console.log(foundPlaylist);
}

/* This function attaches the validateForm function to the form's submit event */
window.addEventListener("DOMContentLoaded", (event) => {
  var form = document.getElementById("edit-playlist");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) {
      event.preventDefault(); // Prevent form submission if validation fails.
    } else {
      processForm(form);
    }

    
    return false;
  });
});
