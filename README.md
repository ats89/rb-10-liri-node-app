# LIRI Bot

* command line node app that takes in parameters and gives you back data
* display latest tweets... add a few tweets to alias account
* will need to send requests to Twitter, Spotify, OMDB APIs
   * [Twitter](https://www.npmjs.com/package/twitter)
   * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
   * [Request](https://www.npmjs.com/package/request)
     * use Request to grab data from the [OMDB API](http://www.omdbapi.com).
   * [DotEnv](https://www.npmjs.com/package/dotenv)

* The `.env1` file will be used by the `dotenv` package to set environment variables to 

* This file will be used by the `dotenv` package to set what are known as environment variables to the global `process.env` object in node. These are values that are meant to be specific to the computer that node is running on, and since we are gitignoring this file, they won't be pushed to github &mdash; keeping our API key information private.

* If someone wanted to clone your app from github and run it themselves, they would need to supply their own `.env` file for it to work.


6. Make a file called `random.txt`.

   * Inside of `random.txt` put the following in with no extra characters or white space:
     
     * spotify-this-song,"I Want it That Way"

7. Make a JavaScript file named `liri.js`.


9. Add the code required to import the `keys.js` file and store it in a variable.
  
* You should then be able to access your keys information like so

  ```js
  var spotify = new Spotify(keys.spotify);
  var client = new Twitter(keys.twitter);
  ```

10. Make it so liri.js can take in one of the following commands:

    * `my-tweets`

    * `spotify-this-song`

    * `movie-this`

    * `do-what-it-says`

### What Each Command Should Do

 

4. `node liri.js do-what-it-says`
 * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.     
     * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
     * Feel free to change the text in that document to test out the feature for other commands.

### BONUS

* In addition to logging the data to your terminal/bash window, output the data to a .txt file called `log.txt`.

* Make sure you append each command you run to the `log.txt` file. 

* Do not overwrite your file each time you run a command.



spotify-this-song,"I Want it That Way",5
get-tweets,realDonaldTrump,6