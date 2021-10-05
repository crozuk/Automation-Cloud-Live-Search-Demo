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
  job_id = body.id;
  //console.log(job_id);
  var results = await pollJobOutput(body.id, "SearchResults");
  res.send(results);
});

//Select item endpoint
app.post('/selected', parse.urlencoded(), async function(req, res) {
  console.log(job_id);
  var data = req.body;
  var response = await fetch("https://api.automationcloud.net/jobs/" + job_id + "/inputs", {
    method: "post",
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    },
    body: JSON.stringify({
        "key": "selected_site",
        data
    })
  })
  console.log(data);
  await pollJobDone(job_id);
  await timeout(1000);
  var screenshot = await getJobScreenshot(job_id);
  res.end(Buffer.from(screenshot, "binary"));
});

//Get job screenshot
async function getJobScreenshot(jobId){
  var response = await fetch("https://api.automationcloud.net/jobs/" + jobId + "/screenshots", {
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    }
  });
  var body = await response.json();
  var latestScreenshot = body.data.reverse()[0];
  console.log(latestScreenshot);
  var response = await fetch("https://api.automationcloud.net" + latestScreenshot.url, {
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    }
  });
  var body = await response.buffer();
  var bodyBase64 = body.toString('base64');
  return bodyBase64;
};

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
//Poll for finish
async function pollJobDone(jobId){
  var response = await fetch("https://api.automationcloud.net/jobs/" + jobId, {
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64")
    }
  });
  var body = await response.json();
  if (body.state === "success" || body.state === "fail"){
    return body;
  }
  await timeout(1000);
  return pollJobDone(jobId);
};
//Timeout function
function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}