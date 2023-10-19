window.onload = function () {
  var playlistDropdown = document.getElementById('select-time-slot');

  var playlistToDisplay = LIST_OF_CURRENT_PLAYLIST.map((playlist) => {
    return `<option value="${playlist.timeSlot}">${playlist.displayTimeSlot}</option>`;
  });

  playlistToDisplay.unshift('<option value="0">Select A Time Slot To Display Playlist</option>');

  playlistDropdown.innerHTML = playlistToDisplay.join(' ');
};

window.addEventListener('DOMContentLoaded', (event) => {
  var selectedTimeSlot = document.getElementById('select-time-slot');
  var playlistName = document.getElementById('playlist-name');
  var playlistId = document.getElementById('playlist-id');
  var songsContainer = document.getElementById('songs-container');

  selectedTimeSlot.addEventListener('change', function (event) {
    var selectedValue = selectedTimeSlot.options[selectedTimeSlot.selectedIndex].value;
    var foundPlayList = false;

    for (var index = 0; index < LIST_OF_CURRENT_PLAYLIST.length; index++) {
      if (LIST_OF_CURRENT_PLAYLIST[index].timeSlot === selectedValue) {
        var selectedPlaylist = LIST_OF_CURRENT_PLAYLIST[index];
        playlistName.value = selectedPlaylist.title;
        playlistId.value = selectedPlaylist.playlistId;

        songsContainer.innerHTML = '';

        for (var index = 0; index < selectedPlaylist.songs.length; index++) {
          addSongToPlaylist(selectedPlaylist.songs[index]);
        }

        foundPlayList = true;
        toggleAllActive();
      }
    }

    if (!foundPlayList) {
      songsContainer.innerHTML = '';
      playlistName.value = '';
      playlistId.value = 0;
    }
  });
});
