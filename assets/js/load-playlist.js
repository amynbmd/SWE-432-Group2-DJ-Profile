async function loadPlaylist(playlist) {
  var playlistName = document.getElementById('playlist-name');
  var playlistId = document.getElementById('playlist-id');
  var songsContainer = document.getElementById('songs-container');

  playlistName.value = playlist.title;
  playlistId.value = playlist.playlistId;
  songsContainer.innerHTML = '';

  for (var index = 0; index < playlist.songs.length; index++) {
    addSongToPlaylist(playlist.songs[index], true);
  }
}


async function clearCurrentPlaylist() {
  var playlistName = document.getElementById('playlist-name');
  var playlistId = document.getElementById('playlist-id');
  var songsContainer = document.getElementById('songs-container');

  playlistName.value = '';
  playlistId.value = 0;
  songsContainer.innerHTML = ''; 
}


window.addEventListener('DOMContentLoaded', (event) => {
  var selectedTimeSlot = document.getElementById('select-time-slot');
  if (selectedTimeSlot) {
    selectedTimeSlot.addEventListener('change', async function (event) {
      var selectedValue = selectedTimeSlot.options[selectedTimeSlot.selectedIndex].value;
      await getAndLoadPlaylist(selectedValue);
    });
  }
});


async function getAndLoadPlaylist(timeSlot) {
  var playlistName = document.getElementById('playlist-name');
  var submitButton = document.getElementById('submit-button');

  const url = window.location.origin + '/api/current-playlists/' + timeSlot.trim();
  const response = await fetch(url);
  saveSelectedTimeSlotToSession(timeSlot);

  try {
    disableFormWhenNoTimeSlotSelected();

    playlistName.placeholder = 'Current Playlist Name';
    submitButton.innerHTML = "SAVE PLAYLIST";

    const playlist = await response.json();

    await loadPlaylist(playlist);

  } catch(e) {
    await clearCurrentPlaylist();

    var songsContainer = document.getElementById('songs-container');
    songsContainer.innerHTML = `
    <div id="no-playlist" style="text-align: center; margin-top: 50px; font-weight: bold;font-size: larger;">
    There's no playlist available for this time slot. Please create a playlist.
    </div>`; 

    playlistName.placeholder = 'New Playlist Name';
    submitButton.innerHTML = "CREATE PLAYLIST";
  }
}