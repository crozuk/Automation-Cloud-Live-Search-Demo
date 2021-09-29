//Express server
var express = require('express');
var app = express();
const port = 3010;

//Static file path
app.use(express.static('static'));

//Index page
app.get('/', function(req, res){
  res.sendFile('static/index.html');
});

//Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})