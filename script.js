const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const moodColors={
    happy:{background:"#fec89a" , primary:"#f8edeb", highlight:"#ffb5a7"},
    sad:{background:"#5f506b" , primary:"#76949f", highlight:"#86bbbd"},
    chill: {background:"#64a6bd" , primary:"#ada7c9", highlight:"#f4cae0"},
    inspirational: {background:"#78a2ee" , primary:"#e1c3f1", highlight:"#f3ddc1"},
    lovey:{background:"#1b1b3a" , primary:"#a74482", highlight:"#ff3562"},
    purple:{background:"#757bc8" , primary:"#ada7ff", highlight:"#e0c3fc"},
};
function updateAlbumArt(song) {
  const albumArtElement = document.getElementById("player-album-art");
  albumArtElement.innerHTML = `<img src="${song.albumArt}" alt="${song.title} cover">`;
}
const songMoods={
    0:"purple",
    1:"sad",
    2:"lovey",
    3:"chill",
    4:"inspirational",
    5:"inspirational",
    6:"chill",
    7:"inspirational",
    8:"happy",
    9:"happy",
    10:"sad"
};

const allSongs = [
  {
    id: 0,
    title: "Purple Desire",
    artist: "The Grey Room / Clark Sims",
    duration: "3:09",
    src: "songs/Purple Desire - The Grey Room _ Clark Sims.mp3",
    albumArt:"images/purple clouds.jpg"
  },
  {
    id: 1,
    title: "At All Costs",
    artist: "The Grey Room / Golden Palms",
    duration: "3:23",
    src: "songs/At All Costs - The Grey Room _ Golden Palms.mp3",
    albumArt:"images/rain on the window.jpg"
  },
  {
    id: 2,
    title: "Me and you and us",
    artist: "Patrick Patrikios",
    duration: "3:51",
    src: "songs/Me and you and us - Patrick Patrikios.mp3",
    albumArt:"images/pink fuzzy heart.jpg"
  },
  {
    id: 3,
    title: "City lights",
    artist: "Patrick Patrikios",
    duration: "2:36",
    src: "songs/City lights - Patrick Patrikios.mp3",
    albumArt:"images/chill room modern with desktop.jpg"

  },
  {
    id: 4,
    title: "Last laugh",
    artist: "Patrick Patrikios",
    duration: "2:42",
    src: "songs/Last laugh - Patrick Patrikios.mp3",
    albumArt:"images/inspirational night sky.jpg"
  },
  {
    id: 5,
    title: "We alright",
    artist: "Patrick Patrikios",
    duration: "2:35",
    src: "songs/We alright - Patrick Patrikios.mp3",
    albumArt:"images/inspirational night sky.jpg"
  },
  {
    id: 6,
    title: "Know Myself",
    artist: "Patrick Patrikios",
    duration: "3:23",
    src: "songs/Know Myself - Patrick Patrikios.mp3",
    albumArt:"images/chill room modern with desktop.jpg"
    
  },
  {
    id: 7,
    title: "When Will I Return",
    artist: "Ryan Stasik, Kanika Moore",
    duration: "2:34",
    src: "songs/When Will I Return - Ryan Stasik _ Kanika Moore.mp3",
    albumArt:"images/inspirational night sky.jpg"
    
  },
  {
    id: 8,
    title: "Butterfly",
    artist: "Patrick Patrikios",
    duration: "2:43",
    src: "songs/Butterfly - Patrick Patrikios.mp3",
    albumArt:"images/butterfly in spring.jpg"
    
  },
  {
    id: 9,
    title: "Oh My",
    artist: "Patrick Patrikios",
    duration: "2:16",
    src: "songs/Oh My - Patrick Patrikios.mp3",
    albumArt:"images/happiness abstract art.jpg"
  },
  {
    id: 10,
    title: "Play Dead",
    artist: "NEFFEX",
    duration: "3:31",
    src: "songs/Play Dead - NEFFEX.mp3",
    albumArt:'images/rain on the window.jpg'
  },
];

function addMoodColors(songId){
    const mood=songMoods[songId];
    if(!mood) return;
    const colors= moodColors[mood];
    document.documentElement.style.setProperty('--app-background-color', colors.background);
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--highlight-color', colors.highlight);
    const albumArt=document.getElementById("player-album-art");
    albumArt.style.animation = "pulse 2s infinite";

};


const audio = new Audio();
let userData = {
  songs: [...allSongs],
  currentSong: null,
  songCurrentTime: 0,
};

const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }
  userData.currentSong = song;
   updateAlbumArt(song);
  addMoodColors(song.id);
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
};

const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;
  
  playButton.classList.remove("playing");
  audio.pause();
};

const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id);
  }
};

const playPreviousSong = () => {
   if (userData?.currentSong === null) return;
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

};

const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : "";
  songArtist.textContent = currentArtist ? currentArtist : "";
};

const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML;

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  };

};

const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);
  } else {
    playSong(userData?.currentSong.id);
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
pauseSong();
setPlayerDisplay();
highlightCurrentSong();
setPlayButtonAccessibleText()

    }
});

const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs());
setPlayButtonAccessibleText();