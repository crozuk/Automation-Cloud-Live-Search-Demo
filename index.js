/* This is loading the environment variables from the .env file. */
// Environment Variables
require('dotenv').config();
const app_secret = process.env.secret;

/* This is loading the Express server and setting the port to 8080. */
//Express server
var express = require('express');
var app = express();
const port = process.env.PORT || 8080;

/* This is loading the body-parser and node-fetch packages. */
//Parse and Fetch packages
var parse = require('body-parser');
var fetch = require('node-fetch');

/* This is telling the server where to find the static files. */
//Static file path
app.use(express.static('static'));

/* This is the route for the index page. */
//Index page
app.get('/', function(req, res){
  res.sendFile('static/index.html');
});

/* This is the route for the search endpoint. It takes the search term from the form and sends it to
the Automation Cloud API. It then polls for the output and sends it back to the client. */
//Search endpoint
app.post('/search', parse.urlencoded(), async function(req, res) {
  console.log(req.body);
  var search_term = req.body.search_term;
  //console.log(search_term);
  var response = await fetch("https://api.automationcloud.net/jobs", {
    method: "post",
    headers: {
      authorization: "Basic " + Buffer.from(app_secret + ":").toString("base64"),
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({
      serviceId: "20ea0e52-1c0d-41ba-9ed2-4b50ca847f31",
      category: "test",
      input: {
        "search_term": search_term
      }
    })
  })
  var body = await response.json();
  job_id = body.id;
  //console.log(body);
  console.log(job_id);
  var results = await pollJobOutput(body.id, "SearchResults");
  res.send(results);
});

/* This is the code that starts the server. */
//Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

/**
 * It polls the API for the output of a job until it is found
 * @param jobId - The ID of the job you want to poll for output.
 * @param outputKey - The key of the output you want to poll for.
 * @returns The output of the job.
 */
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

/**
 * It polls the API every second until the job is done
 * @param jobId - The ID of the job you want to poll.
 * @returns The job status.
 */
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

/**
 * The timeout function returns a promise that resolves after a given number of milliseconds.
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that will resolve after a certain amount of time.
 */
//Timeout function
function timeout(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}