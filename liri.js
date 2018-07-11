require('dotenv').config();

const inquirer = require('inquirer');
const request = require('request');
const fs = require('fs');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
const twitter = new Twitter(keys.twitter);

function inquireCommand() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'Which command do you want to run?',
      choices: ['get-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
      name: 'command'
    },
  ]).then(answers => {
    if (answers.command === 'get-tweets') {
      inquireTwitterInfo();
    } else if (answers.command === 'spotify-this-song') {
      inquireSpotifyInfo(); 
    } else if (answers.command === 'movie-this') {
      inquireMovieName(); 
    } else { // 'do-what-it-says'
      fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) throw err;

        const inputs = data.split(',');

        outputMsg('Running the \'do-what-it-says\' command:');
        outputMsg(`It says: ${data}:`);

        if (inputs[0] === 'get-tweets') {
          const screenName = inputs[1] ? inputs[1] : '';
          const count = isNaN(inputs[2]) || inputs[2] < 1 || inputs[2] > 20
          ? 5 : inputs[2];

          if (screenName) {
            displayTweetsData(screenName, count);
          } else {
            console.log('Twitter handle missing in random.txt.');
          };
        } else if (inputs[0] === 'spotify-this-song') {
          const songName = inputs[1] ? inputs[1] : '';
          const limit = isNaN(inputs[2]) || inputs[2] < 1 || inputs[2] > 10
            ? 3 : inputs[2];

          if (songName) {
            displaySpotifyData(songName, limit);
          } else {
            console.log('Song name missing in random.txt.');
          };
        } else if (inputs[0] === 'movie-this') {
          if (inputs[1]) {
            displayMovieData(inputs[1]);
          } else {
            console.log('Movie name missing in random.txt.');
          };
        } else {
          console.log('Invalid command in random.txt.');
        };
      }); 
    }
  });
}

function inquireTwitterInfo() {
  outputMsg('Running the \'get-tweets\' command:');
  inquirer.prompt([
    {
      type: 'input',
      message: 'What twitter user handle?',
      name: 'screenName'
    },
    {
      type: 'input',
      message: 'How many tweets do you want displayed (1-20)?',
      name: 'count',
      default: 5,
      validate: (name) => {
        if (isNaN(name)) {
          outputMsg('\nInvalid input: not a number!');
          return false;
        } else if (name < 1 || name > 20) {
          outputMsg('\nInvalid input: out of range!');
          return false;
        } else {
          return true;
        };
      }
    },
    {
      type: 'confirm',
      message: 'Are you sure:',
      name: 'confirm',
      default: true
    }
  ]).then(answers => {
    !answers.confirm ? 
      inquireTwitterInfo() : displayTweetsData(answers.screenName, answers.count);
  });
}

function inquireSpotifyInfo() {
  outputMsg('Running the \'spotify-this-song\' command:');
  inquirer.prompt([
    {
      type: 'input',
      message: 'What song are you looking for?',
      name: 'songName'
    },
    {
      type: 'input',
      message: 'How many results do you want displayed (1-10)?',
      name: 'limit',
      default: 3,
      validate: (name) => {
        if (isNaN(name)) {
          outputMsg('\nInvalid input: not a number!');
          return false;
        } else if (name < 1 || name > 10) {
          outputMsg('\nInvalid input: out of range!');
          return false;
        } else {
          return true;
        };
      }
    },
    {
      type: 'confirm',
      message: 'Are you sure:',
      name: 'confirm',
      default: true
    }
  ]).then(answers => {
    !answers.confirm ? 
      inquireSpotifyInfo() : displaySpotifyData(answers.songName, answers.limit); 
  });
}

function inquireMovieName() {
  outputMsg('Running the \'movie-this\' command:');
  inquirer.prompt([
    {
      type: 'input',
      message: 'What movie?',
      name: 'movie'
    },
    {
      type: 'confirm',
      message: 'Are you sure:',
      name: 'confirm',
      default: true
    }
  ]).then(answers => { 
    !answers.confirm ? inquireMovieName() : displayMovieData(answers.movie); 
  });
}

// Display Functions (console.log)

function displayTweetsData(screenName, count) {
  const  params = {screen_name: screenName, count: count};
  twitter.get('statuses/user_timeline', params, (error, tweets, response) => {
    let tweetsArray = [];
    if (!error) {
      for (let tweet of tweets) {
        tweetsArray.push({
          createdAt: tweet.created_at,
          text: tweet.text,
          user: tweet.user.screen_name,
          retweetCount: tweet.retweet_count,
          favoriteCount: tweet.favorite_count
        });
      };

      outputMsg(`Here are the last ${count} tweets on @${screenName}'s timeline:`);
      outputMsg(JSON.stringify(tweetsArray, null, 2));
    } else {
      outputMsg('Twitter user could not be found.');
    }
  });
}

function displaySpotifyData(songName, limit, hideIntroMsg) {
  spotify.search({ type: 'track', query: songName, limit: limit}, (err, data) => {
    if (!err && data.tracks.items.length) {
      const songResults = data.tracks.items;
      let songsArray = [];

      for (let song of songResults) {
        songsArray.push({
          name: song.name,
          artist: song.artists[0].name,        
          album: song.album.name,
          previewLink: song.preview_url
        }); 
      };

      if (!hideIntroMsg) outputMsg(`Here are the results for '${songName}':`);
      outputMsg(JSON.stringify(songsArray, null, 2));
    } else {
      outputMsg('Your song could not be found! Here is a nice song:');
      displaySpotifyData('The Sign Ace of Base' ,1, true);
    };
  });
}

function displayMovieData(movie, hideIntroMsg) {
  const titleParam = movie.replace(/ /g, '+');

  request(`http://www.omdbapi.com/?t=${titleParam}&plot=short&apikey=trilogy`, (error, response, body) => {
    if (!error && response.statusCode === 200 && JSON.parse(body).Response === 'True') {
      const data = JSON.parse(body);

      const movieData = {
        title: data.Title,
        year: data.Year,
        imdbRating: data.Ratings[0] ? data.Ratings[0].Value : 'N/A',
        rottenTomatoesRating: data.Ratings[1] ? data.Ratings[1].Value : 'N/A',
        country: data.Country,
        language: data.Language,
        plot: data.Plot,
        actors: data.Actors
      };

      if (!hideIntroMsg) outputMsg('Here is your movie:');
      outputMsg(JSON.stringify(movieData, null, 2));
    } else { // error or movie not found
      outputMsg('Your movie could not be found! Here is a nice movie:');
      displayMovieData('Mr. Nobody', true);
    };
  });
}

// Output
function outputMsg(msg) {
  console.log(msg);
  logOutput(msg);
}

function logOutput(msg) {
  fs.appendFile('log.txt', `\n${msg}`, (err) => {
    if (err) throw err;
  });
};

// Initiate liri bot
inquireCommand();

