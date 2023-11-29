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

async function processForm(form) {
  var playlistName = document.getElementById('playlist-name').value;
  var playlistId = document.getElementById('playlist-id').value;
  var selectedTimeSlot = document.getElementById('select-time-slot');
  var selectedValue = selectedTimeSlot.options[selectedTimeSlot.selectedIndex].value;

  var activeSongs = [...form.querySelectorAll('input[name=song-toggle]:checked')];
  var songsId = activeSongs.map(song => {
    return Number(song.dataset.songid);
  });

  let playlist = {
    playlistId: playlistId,
    playlistName: playlistName, 
    timeSlot: selectedValue,
    songsId: songsId
  };

  const url = window.location.origin + '/api/current-playlists';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playlist)
  });

  const updatedPlaylist = await response.json();

  loadPlaylist(updatedPlaylist);
}

/* This function attaches the validateForm function to the form's submit event */
window.addEventListener("DOMContentLoaded", (event) => {
  var form = document.getElementById("edit-playlist");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      if (!validateForm()) {
        event.preventDefault(); // Prevent form submission if validation fails.
      } else {
        processForm(form);
      }
  
      
      return false;
    });
  }
});
