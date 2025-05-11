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
