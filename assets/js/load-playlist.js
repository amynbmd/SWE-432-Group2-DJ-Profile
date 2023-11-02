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


window.addEventListener('DOMContentLoaded', (event) => {
  var selectedTimeSlot = document.getElementById('select-time-slot');

  selectedTimeSlot.addEventListener('change', async function (event) {
    var selectedValue = selectedTimeSlot.options[selectedTimeSlot.selectedIndex].value;
    const url = window.location.origin + '/api/current-playlists/' + selectedValue.trim();
    const response = await fetch(url);
    const playlist = await response.json();
  
    await loadPlaylist(playlist);
  });
});
