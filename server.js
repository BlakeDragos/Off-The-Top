// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require('morgan');
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("./models");
var PORT = process.env.PORT || 3000;

var app = express();


app.use(logger('dev'));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(__dirname + "/public"));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/off-the-top');

// Database configuratio


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.get("/", function (req, res) {
  res.render("index");

});

app.get("/saved", function (req, res) {
  db.posts.find({}, function (error, found) {
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      var saveObj = {
        saved: found
      };
      res.render("index", saveObj);
    }
  });
});


app.get("/all", function (req, res) {
  // Find all results from the scrapedData collection in the db
  axios.get("https://old.reddit.com/r/ProgrammerHumor/").then(function (response) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    var posts = [];
    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("p.title").each(function (i, element) {

      // Save the text of the element in a "title" variable
      var title = $(element).text();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().attr("href");

      var passObject = {
        title: title,
        link: link
      };

      // Save these results in an object that we'll push into the results array we defined earlier
      posts.push(passObject);
    });
    var postObj = {
      posts: posts
    };
    res.render("index", postObj);
  });
});

app.post("/save", function (req, res) {
  // Insert the note into the notes collection
  db.posts.create(req.body, function (error, saved) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    else {
      // Otherwise, send the note back to the browser
      // This will fire off the success function of the ajax request
      res.send(saved);
    }
  });
});

app.post("/update", function (req, res) {
  // When searching by an id, the id needs to be passed in
  // as (mongojs.ObjectId(IdYouWantToFind))

  // Update the note that matches the object id
  db.posts.update(
    {
      title: req.body.title
    },
    {
      // Set the title, note and modified parameters
      // sent in the req body.
      $set: {
        notes: req.body.notes
      }
    },
    function (error, edited) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(edited);
        res.send(edited);
      }
    }
  );
});

app.post("/delete", function (req, res) {
  // Remove a note using the objectID
  db.posts.remove(
    {
      title: req.body.title
    },
    function (error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      }
      else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        res.send(removed);
      }
    }
  );
});


app.listen(PORT, function () {
  console.log("App running on port 3000!");
});
