


// Seed song data
var LIST_OF_CURRENT_PLAYLIST = [
  {
    playlistId: 1,
    title: 'Songs that hit different',
    timeSlot: "5PM_TO_7PM",
    displayTimeSlot: "5pm - 7pm",
    songs: [
      {
        songId: 1,
        title: 'Like a Rolling Stone',
        artist: 'Bob Dylan',
        album: 'Highway 61 Revisited',
        year: '1965',
      },
      {
        songId: 2,
        title: "(I Can't Get No) Satisfaction",
        artist: 'The Rolling Stones',
        album: 'Out of Our Heads',
        year: '1965',
      },
      {
        songId: 3,
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        year: '1971',
      },
      {
        songId: 4,
        title: "What's Going On",
        artist: 'Marvin Gaye',
        album: "What's Going On",
        year: '1971',
      },
      {
        songId: 5,
        title: 'Respect',
        artist: 'Aretha Franklin',
        album: 'I Never Loved a Man the Way I Love You',
        year: '1967',
      },
      {
        songId: 6,
        title: 'Good Vibrations',
        artist: 'The Beach Boys',
        album: 'Smiley Smile/Wild Honey',
        year: '1966',
      },
      {
        songId: 7,
        title: 'Johnny B. Goode',
        artist: 'Chuck Berry',
        album: 'The Anthology',
        year: '1958',
      },
    ],
  },
  {
    playlistId: 2,
    title: 'Songs that make you feel happy',
    timeSlot: "7PM_TO_9PM",
    displayTimeSlot: "7pm - 9pm",
    songs: [
      {
        songId: 303,
        title: 'Heart of Gold',
        artist: 'Neil Young',
        album: 'Harvest',
        year: '1972',
      },
      {
        songId: 304,
        title: "Sign 'O' The Times",
        artist: 'Prince',
        album: "Sign 'O' The Times",
        year: '1987',
      },
      {
        songId: 305,
        title: 'One Way or Another',
        artist: 'Blondie',
        album: 'Parallel Lines',
        year: '1978',
      },
      {
        songId: 306,
        title: 'Like a Prayer',
        artist: 'Madonna',
        album: 'Like a Prayer',
        year: '1989',
      },
    ],
  },
  {
    playlistId: 3,
    title: 'Songs that make you feel powerful',
    timeSlot: "9PM_TO_11PM",
    displayTimeSlot: "9pm - 11pm",
    songs: [
      {
        songId: 392,
        title: 'Bitter Sweet Symphony',
        artist: 'The Verve',
        album: 'Urban Hymns',
        year: '1997',
      },
      {
        songId: 393,
        title: 'Whipping Post',
        artist: 'The Allman Brothers Band',
        album: 'At Fillmore East',
        year: '1971',
      },
      {
        songId: 394,
        title: 'Ticket to Ride',
        artist: 'The Beatles',
        album: 'Help!',
        year: '1965',
      },
      {
        songId: 395,
        title: 'Stills, Nash & Young',
        artist: 'Crosby',
        album: 'Decade',
        year: '1970',
      },
      {
        songId: 396,
        title: 'I Know You Got Soul',
        artist: 'Eric B. & Rakim',
        album: 'Paid In Full',
        year: '1987',
      },
      {
        songId: 398,
        title: 'Roxanne',
        artist: 'The Police',
        album: "Outlandos d'Amour",
        year: '1978',
      },
    ],
  },
  {
    playlistId: 4,
    title: 'Songs to sing in the shower',
    timeSlot: "11PM_TO_1AM",
    displayTimeSlot: "11pm - 1am",
    songs: [
      {
        songId: 126,
        title: 'Will You Love Me Tomorrow',
        artist: 'The Shirelles',
        album: 'Girl Group Greats',
        year: '1960',
      },
      {
        songId: 127,
        title: 'Shake',
        artist: 'Big Joe Turner',
        album: 'The Very Best of Big Joe Turner',
        year: '1954',
      },
      {
        songId: 128,
        title: 'Changes',
        artist: 'David Bowie',
        album: 'Hunky Dory',
        year: '1971',
      },
      {
        songId: 129,
        title: 'Rock and Roll Music',
        artist: 'Chuck Berry',
        album: "Johnny B. Goode: His Complete '50s Chess Recordings",
        year: '1957',
      },
      {
        songId: 130,
        title: 'Born to Be Wild',
        artist: 'Steppenwolf',
        album: 'Steppenwolf',
        year: '1968',
      },
    ],
  }
];

const LIST_OF_PREVIOUS_PLAYLIST = [
  {
    playlistId: 5,
    title: 'Songs that make you dance',
    songs: [
      {
        songId: 230,
        title: 'Mannish Boy',
        artist: 'Muddy Waters',
        album: 'The Anthology',
        year: '1955',
      },
      {
        songId: 231,
        title: 'Moondance',
        artist: 'Van Morrison',
        album: 'Moondance',
        year: '1970',
      },
      {
        songId: 232,
        title: 'Just Like a Woman',
        artist: 'Bob Dylan',
        album: 'Blonde on Blonde',
        year: '1966',
      },
      {
        songId: 234,
        title: 'Only the Lonely',
        artist: 'Roy Orbison',
        album: 'For the Lonely: 18 Greatest Hits',
        year: '1960',
      },
      {
        songId: 235,
        title: 'We Gotta Get Out Of This Place',
        artist: 'The Animals',
        album: 'Retrospective',
        year: '1965',
      },
    ],
  },
  {
    playlistId: 6,
    title: 'Songs to scream your heart out',
    songs: [
      {
        songId: 227,
        title: 'Fire and Rain',
        artist: 'James Taylor',
        album: 'Sweet Baby James',
        year: '1970',
      },
      {
        songId: 228,
        title: 'Should I Stay or Should I Go',
        artist: 'The Clash',
        album: 'Combat Rock',
        year: '1982',
      },
      {
        songId: 229,
        title: 'Good Times',
        artist: 'Chic',
        album: 'Risqué',
        year: '1979',
      },
    ],
  },
  {
    playlistId: 7,
    title: 'Songs to motivate you',
    songs: [
      {
        songId: 341,
        title: 'Spirit in the Sky',
        artist: 'Norman Greenbaum',
        album: 'Spirit in the Sky',
        year: '1970',
      },
      {
        songId: 342,
        title: 'Sweet Jane',
        artist: 'The Velvet Underground',
        album: 'Loaded (Fully Loaded Edition)',
        year: '1970',
      },
      {
        songId: 343,
        title: 'Wild Horses',
        artist: 'The Rolling Stones',
        album: 'Sticky Fingers',
        year: '1971',
      },
      {
        songId: 344,
        title: 'Beat It',
        artist: 'Michael Jackson',
        album: 'Thriller',
        year: '1982',
      },
      {
        songId: 345,
        title: 'Beautiful Day',
        artist: 'U2',
        album: "All That You Can't Leave Behind",
        year: '2000',
      },
      {
        songId: 346,
        title: 'Walk This Way',
        artist: 'Aerosmith',
        album: 'Toys in the Attic',
        year: '1975',
      },
      {
        songId: 347,
        title: "Maybe I'm Amazed",
        artist: 'Paul McCartney',
        album: 'McCartney',
        year: '1970',
      },
    ],
  },
  {
    playlistId: 8,
    title: 'Songs that make you cry',
    songs: [
      {
        songId: 353,
        title: 'Piece of My Heart',
        artist: 'Big Brother & The Holding Company',
        album: 'Cheap Thrills',
        year: '1968',
      },
      {
        songId: 354,
        title: 'La Bamba',
        artist: 'Ritchie Valens',
        album: 'The Ritchie Valens Story',
        year: '1958',
      },
      {
        songId: 355,
        title: 'California Love (remix) (feat. Dr. Dre & Roger Troutman)',
        artist: '2Pac',
        album: 'Greatest Hits',
        year: '1996',
      },
      {
        songId: 356,
        title: 'Candle in the Wind',
        artist: 'Elton John',
        album: 'Goodbye Yellow Brick Road',
        year: '1973',
      },
      {
        songId: 357,
        title: 'That Lady (Parts 1 & 2)',
        artist: 'The Isley Brothers',
        album: 'The Essential Isley Brothers',
        year: '1973',
      },
    ],
  }
];
