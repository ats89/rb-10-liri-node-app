# rb-10-liri-node-app

* This is a command line node app that takes in parameters and outputs data to the `console` and `log.txt`.
* [Inquirer.js](https://www.npmjs.com/package/inquirer) is used to create a user-friendly command line interface.
* Four commands are available:
  * `get-tweets`
    * accepts two params: **user Twitter handle** and **tweet count**
    * outputs the latest tweets of specified Twitter user
    * utilizes [Twitter for Node.js](https://www.npmjs.com/package/twitter) package
  * `spotify-this-song`
    * accepts two params: **song name** and **limit** (for number of search results to display)
    * outputs the search result for the specified song
    * utilizes [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package
  * `movie-this`
    * accepts one param: **movie title**
    * outputs the result for the specified movie
    * utilizes [Request - Simplified HTTP client](https://www.npmjs.com/package/request) package and [OMDb API](http://www.omdbapi.com)
  * `do-what-it-says`
    * reads a string from `random.txt`
    * string is of format: `{command},{param1},{param2}`, where `{param2}` is optional
    * examples:
      * `get-tweets,realDonaldTrump,3`
      * `spotify-this-song,I Want it That Way`
      * `movie-this,Avengers`
* A `.env` file is used by the [dotenv](https://www.npmjs.com/package/dotenv) package to set environment variables to the global `process.env` object in node. These values are specific to the computer node is running on, thus keeping API key information private as long as `.env` is included in `.gitignore`.

## Using the Liri Bot

* `git clone` this repository
* Rename `.env.example` to `.env`, and replace the placeholder values with your own API keys and tokens.
* Navigate to directory of the repository, and run `node liri.js`!

## Liri Bot in Action
