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
