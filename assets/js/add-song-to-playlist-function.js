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

async function removeNoPlaylist() {
  if (document.getElementById('no-playlist')) {
    document.getElementById('no-playlist').remove();
  }
}

async function initPage() {
  const selectTimeSlot = sessionStorage.getItem("select-time-slot");

  if (selectTimeSlot) {
    const selectElement = document.getElementById('select-time-slot'); 
    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].value === selectTimeSlot) {
        selectElement.selectedIndex = i;
        break;
      }
    }

    await getAndLoadPlaylist(selectTimeSlot);

  } else {
    disableFormWhenNoTimeSlotSelected();
  } 
}

function disableFormWhenNoTimeSlotSelected() {
  var selectedTimeSlot = document.getElementById('select-time-slot');
  var selectedValue = selectedTimeSlot.options[selectedTimeSlot.selectedIndex].value;

  var playlistName = document.getElementById('playlist-name');
  var submitButton = document.getElementById('submit-button');
  var searchPrevious = document.getElementById('search-previous');
  var searchSong = document.getElementById('search-song');

  if (selectedValue == 0 || selectedValue == '0') {
    playlistName.disabled = true;
    submitButton.disabled = true;
    searchPrevious.disabled = true;
    searchSong.disabled = true;

  } else {
    playlistName.disabled = false;
    submitButton.disabled = false;
    searchPrevious.disabled = false;
    searchSong.disabled = false;
  }
}


// window.addEventListener('DOMContentLoaded', (event) => {
//   var playlistName = document.getElementById('playlist-name');
//   playlistName.addEventListener('change', async function (event) {
//     savePlaylistNameToSession(playlistName.value);
//   });
// })


/**************************************BEGIN: sessionStorage**************************************/
function savePlaylistToSession(playlist) {
  sessionStorage.setItem("playlistId", playlist.playlistId);
  sessionStorage.setItem("songs", JSON.stringify(playlist.songs.map(song => {
    return {...song, active: 1}
  })));
}

function saveSelectedTimeSlotToSession(selectedValue) {
  sessionStorage.setItem("select-time-slot", selectedValue);
}

function savePlaylistNameToSession(playlistName) {
  sessionStorage.setItem("title", playlistName.trim());
}

function addSongToSessionPlaylist(song) {
  let songs = JSON.parse(sessionStorage.getItem("songs"));

  sessionStorage.setItem("songs", JSON.stringify([...songs, {...song, active: 0}]));
}
/**************************************End: sessionStorage**************************************/



window.addEventListener('DOMContentLoaded', (event) => {
  var userProfile = document.getElementById('user-profile');
  const openModalBtn = document.querySelector(".btn-open");
  const closeModalBtn = document.querySelector(".btn-close");
  const logoutModalBtn = document.querySelector(".btn-logout");

  userProfile.addEventListener('click', async function (event) {
    console.log('user-profile');

  });

  openModalBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  logoutModalBtn.addEventListener("click", logout);
});

function openModal() {
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

function closeModal() {
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");

  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};


function logout() {
  closeModal();
  sessionStorage.clear();
  window.location = '/';   
};