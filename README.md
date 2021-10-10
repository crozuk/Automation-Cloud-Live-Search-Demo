# Integrating with Automation Cloud
## Live Search Example
The aim of this example is to create an [Automation Cloud](https://automation.cloud) script that searches ‘DuckDuckGo’ for a specified search term, returns the search results - and take a webpage screenshot of the result selected by the user.

This example highlights how to input form values, crawl a webpage for data and respond to users input using the Automation Cloud platform.

## The script
The script, created using the AutoPilot software will perform the following -

* Navigate to [DuckDuckGo](duckduckgo.com)
* Search for user <input>
* Wait for the page to load
* Output the results
* Click on the user <input> result
* Take a screenshot of the selected page

### Creating the script in Autopilot

Our script will navigate to the ‘DuckDuckGo’ search page - input the specified search term into the search field and submit the form. 

The results of this search (title, snippet and URL) will be outputted by the script. This output is used to allow the user to select a search result - for the script to then generate a screenshot of this page.

## Integrating Automation Cloud
### The back end

Our backend service acts as a proxy between the front end and the Automation Cloud platform.

### The front end 

The front end provides an interface for the user to input a search term, views the output selects and select a second input from these results.

In this example we will be integrating the functionality on a static HTML site (served via an express NodeJS server) using jQuery to interact with the backend service.