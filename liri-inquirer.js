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
      choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
      name: 'command'
    },
  ]).then(answers => {
    if (answers.command === 'my-tweets') {
      // 
    } else if (answers.command === 'spotify-this-song') {
      // 
    } else if (answers.command === 'movie-this') {
      inquireMovieName(); 
    } else { // 'do-what-it-says'
      // 
    }
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
    (!answers.confirm) ? inquireMovieName() : displayMovieData(answers.movie); 
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
        imdbRating: data.Ratings[0].Value,
        rottenTomatoesRating: data.Ratings[1].Value,
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

