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

Run `npm run start` (the script is defined in `package.json`).

Then using Postman, should be able to make a GET request to `localhost:3000`. Then should see a garbled mess of a response because I am still working on it.

To debug the app, either go to the run and debug tab and choose the `Debug launch` process and run it, or run `npm run debug` and go to the run and debug tab and choose the `Debug attach` process and run it to attach the debugger to the running process.

## Stuff I learned

Setting up typescript is not as simple as I thought it was.

- First step is to install some npm packages, namely `ts-node` and `typescript`.
  - `ts-node` is to compile the typescript into Javascript and run it. Because installing NodeJS does not come with any support for anything typescript.
    - There are two ways to actually install `ts-node`, globally and locally.
    - Globally installing means to run `npm install ts-node -g`, which makes `ts-node` available for your whole system.
      - This means that you can run `ts-node` CLI on any project regardless of if they have `ts-node` in the node_modules folder.
      - However, this approach is generally not recommended as you only want to be able to run `ts-node` on typescript projects.
    - Locally installing means it is in the dependencies folder in `package.json`, typically the dev dependencies since it is technically not needed in production.
      - I had the misconception that installing it locally in `node_modules` makes it so that if you are in the terminal you can run `ts-node` in the command line. However, that is not true.
      - You can only run `ts-node` on the command line if it is a binary executable in a place defined in the `$PATH` environment variable in the OS. When you install `ts-node` globally the path is automatically added and the binary executable is provided.
      - Instead, to use `ts-node` locally, what you should do is use the scripts in `package.json`.
  - I am currently not too sure what the `typescript` npm package is for.
    - Seems like it provides the typescript compiler. It is needed for `ts-node` to work because `ts-node` does not have a compiler internally.
- Next, we need to compile and run it. `ts-node` is a runner

## Notes

- First understand Cheerio parsing and traversal. `$` you get from `cheerio.load` is a tree representation, but `$` is NOT the actual tree, it is a function that allows you to traverse the tree easily.
- Understand the structure of the HTML at the area of interest. It is not so simple as finding "High" and then looking at the element below it, it is more like
  - a div that contains a h4 that says "today's highs and lows"
  - or actually there is a div that contains an image where the alt text is "highest temperature recorded today"
    - so we can find this image, assuming the alt text doesn't change, and then get the div above it, and then get the div below that and it contains the high temp
    - the low temp is exactly the same process but the alt text is "lowest temperature recorded today"
  - I did the second one, and it seems to work

Progress as of 27/12/25 is that I have something that works, but

- Only did it for high temp. I want to abstract it out into functions so that it is easier to do the low temp without having to duplicate too much code, and also possibly design it in a way that is easy to use for rainfall and stuff (not strictly necessary, but it will be a good indication of good design)
- I need to revisit the response body. I need to handle cases where the scraping fails because I should not assume that the structure will always remain the same as it does. If the structure changes and so my code fails, I want to know exactly where it fails.
