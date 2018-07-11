require('dotenv').config();

const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);

function extractSpotifyTrackData(data) {
  return {
    artists: data.tracks.items[0].album.artists[0].name,
    songName: data.tracks.items[0].name,
    previewLink: data.tracks.items[0].preview_url,
    albumName: data.tracks.items[0].album.name
  };
}

// spotify.search({ type: 'track', query: 'I wish i\'d known', limit: 5 }, (err, data) => {
//   if (err) {
//     // no song found
//     return console.log({ 
//       artists: 'Ace of Base',
//       songName: 'The Sign',
//       previewLink: 'https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=71570300773e431c888c64e2ae235412',
//       albumName: 'The Sign (US Album) [Remastered]' });
//     };

//     for(let result of data.tracks.items) {
//       console.log(result);
//     }
//     //console.log(extractSpotifyTrackData(data)); 
// });

function JSONstringify(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, '\t');
    }

    var 
        arr = [],
        _string = 'color:green',
        _number = 'color:darkorange',
        _boolean = 'color:blue',
        _null = 'color:magenta',
        _key = 'color:red';

    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var style = _number;
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                style = _key;
            } else {
                style = _string;
            }
        } else if (/true|false/.test(match)) {
            style = _boolean;
        } else if (/null/.test(match)) {
            style = _null;
        }
        arr.push(style);
        arr.push('');
        return '%c' + match + '%c';
    });

    arr.unshift(json);

    console.log.apply(console, arr);
}

