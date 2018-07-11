require('dotenv').config();

const inquirer = require('inquirer');
const request = require('request');
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
      // 
    } else if (answers.command === 'movie-this') {
      inquireMovieName(); 
    } else { // 'do-what-it-says'
      // 
    }
  });
}

function inquireTwitterInfo() {
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
          console.log('\nInvalid input: not a number!');
          return false;
        } else if (name < 1 || name > 20) {
          console.log('\nInvalid input: out of range!');
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

function inquireMovieName() {
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

      console.log(`Here are the last ${count} tweets on @${screenName}'s timeline:`);
      console.log(JSON.stringify(tweetsArray, null, 2));
    } else {
      console.log('That twitter user could not be found.');
    }
  });
}

function displayMovieData(movie, hideIntroMsg) {
  const titleParam = movie.replace(/ /g, '+');

  request(`http://www.omdbapi.com/?t=${titleParam}&y=&plot=short&apikey=trilogy`, (error, response, body) => {
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

      if (!hideIntroMsg) console.log('Here is your movie:');
      console.log(JSON.stringify(movieData, null, 2));
    } else { // error or movie not found
      console.log('Your movie could not be found! Here is a nice movie:');
      displayMovieData('Mr. Nobody', true);
    };
  });
}

inquireCommand();
