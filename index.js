// Enviroment Variables
require('dotenv').config();
const app_secret = process.env.secret;
//Log App Secret Key
console.log(app_secret);

//Express server
var express = require('express');
var app = express();
const port = 3001;

//Parse and Fetch packages
var parse = require('body-parser');
var fetch = require('node-fetch');

//Static file path
app.use(express.static('static'));

//Index page
app.get('/', function(req, res){
  res.sendFile('static/index.html');
});

//Search endpoint
app.post('/search', parse.urlencoded(), async function(req, res) {
  console.log(req.body);
  var search_term = req.body.search_term;
  //console.log(search_term);
  var response = await fetch("https://api.automationcloud.net/jobs", {
    method: "post",
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    },
    body: JSON.stringify({
      serviceId: "20ea0e52-1c0d-41ba-9ed2-4b50ca847f31",
      category: "test",
      input: {
        search_term
      }
    })
  })
  var body = await response.json();
  var job_id = body.id;
  console.log(job_id);
  var results = await pollJobOutput(body.id, "SearchResults");
  res.send(results);
});

//Select item endpoint
app.post('/selected', parse.urlencoded(), async function(req, res) {
  console.log(req.body);
});

//Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

//Poll for output
async function pollJobOutput(jobId, outputKey){
  var response = await fetch("https://api.automationcloud.net/jobs/" + jobId + "/outputs/" + outputKey, {
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    }
  });
  var body = await response.json();
  if (body.code === "notFound"){
    await timeout(1000);
    return pollJobOutput(jobId, outputKey)
  }
  return body;
};
//Timeout function
function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}