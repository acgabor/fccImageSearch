// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
//var generalFunc = require('./generalFunc');
var dbFunc=require('./dbFunc');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.ENGINE_ID, process.env.API_KEY);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/latestSearch", function (request, response) {
  dbFunc.getLatestSearch(function(err,data){
    if (err) throw err;
    response.send(data)
  })  
});

app.get("/api/imagesearch/*", function (request, response) {  
  var searchWord=request.params[0]
  var pageToShow=parseInt(request.query.offset)

  if (isNaN(pageToShow)){
   pageToShow=1 
  }

  dbFunc.saveSearch(searchWord)
  client.search(searchWord, {page: 1}).then(function(imageData) {   
    var res = imageData.map(function(data) { 
        return {
          "url":data['url'],
          "snippet":data['description'],
          "thumbnail":data['thumbnail']['url'],
          "context":data['parentPage']
        }
      });
    response.send(res)
    
  })
 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
