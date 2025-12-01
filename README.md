# Web Scraper for Meteorological Service Singapore website

A typescript based web scraper for the Meteorological Service Singapore website

## Goal

The explicit goal is to, with a click of a button, obtain information from the website. For the first iteration, we only aim for the following information:

1. The high and low temperature value
1. The high and low temperature location
1. The high and low temperature time

For the first iteration, this application will be hosted locally, with the request being sent with cURL or Postman. The return will simply be a JSON object.

## Future iterations

### Iteration two

The second iteration will focus on reading and manipulating an external file, most likely a CSV file

### Iteration three

The third iteration will likely focus on getting more information, such as the 24 hour forecast, the 4 day outlook, etc.

### Iteration four

Iteration four will focus on hosting and cron scheduling to automatically run the endpoint without human action.

## Running the app (1/12/2025)

Currently the app is just a single `index.ts`, running an express backend using typescript. It is exposing port 3000.

To run the app, ensure that you can run `ts-node`. [`ts-node`](https://www.npmjs.com/package/ts-node) is a popular typescript runner and is what I used to get it to work.

The command I used is `ts-node ./src/index.ts`. Then using Postman, should be able to make a GET request to `localhost:3000`. Then should see a garbled mess of a response because I am still working on it.
