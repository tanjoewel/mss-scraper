import express from "express";
import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";
import type { Element } from "domhandler";

import { parsePResults, parseHTMLResults, MSSParser } from "./parser/MSSParser";
import { formatResponse, MSSResponse } from "./formatter/MSSFormatter";

const app = express();

const MSSHomepageURL: string = "https://www.weather.gov.sg/home/";

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

app.get("/", async (req, res) => {
  try {
    const GetResponse: AxiosResponse<string, any> = await Axios.get(MSSHomepageURL);
    const data: string = GetResponse.data;
    const $: cheerio.CheerioAPI = cheerio.load(data);

    const highTempParsed: parseHTMLResults = queryHighestLowestTemperature("highest temperature recorded today", $);
    const lowTempParsed: parseHTMLResults = queryHighestLowestTemperature("lowest temperature recorded today", $);
    // const highRainfallParsed: parseHTMLResults = queryHighestLowestTemperature("")

    const result: MSSResponse = formatResponse(highTempParsed, lowTempParsed);

    let highForecast: string = queryForecast("Forecast maximum", $);
    let lowForecast: string = queryForecast("Forecast minimum temperature", $);
    console.log("highForecast: ", highForecast, "\nlowForecast: ", lowForecast);

    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("Error fetching response from MSS website");
  }
});

/**
 * Not sure if this is the best way to abstract this out, but this should at least be a work in progress.
 * This function (currently) takes in the cheerio.CheerioAPI and an alt text, and parses using a very specific structure.
 * Specifically, it finds an image with the given alt text, then finds the div immediately after the div encompassing the image.
 * This div contains a h4 with the value, and a p element with the location and time separated by a <br/> element
 * @param altText alt text of image
 * @param $ the cheerio API
 * Returns a JSON
 */
function queryHighestLowestTemperature(altText: string, $: cheerio.CheerioAPI): parseHTMLResults {
  const jqueryStringForImage: string = `img[alt="${altText}"]`;
  const divContainingImage = $(jqueryStringForImage).parent();
  const succeedingDiv = divContainingImage.next();
  const value: string = succeedingDiv.find("h4").text().trim();
  const pElement: cheerio.Cheerio<Element> = succeedingDiv.find("p");
  const parsePResponse: parsePResults = MSSParser.parsePElement(pElement);
  if (parsePResponse.isMultipleLocations) {
    return { value, location: "multiple locations", time: undefined };
  }
  const pArr: string[] = parsePResponse.array;
  const location: string = pArr[0].trim();
  const time: string = pArr[1].trim();
  return { value, location, time };
}

/**
 * Parses the forecast based on the alt text from the cheerio API.
 * As of 4/3/2026, the forecast temperature is in a h2 in a succeeding div from the image.
 * @param altText alt text of image
 * @param $ the cheerio API
 */
function queryForecast(altText: string, $: cheerio.CheerioAPI): string {
  const jqueryStringForImage: string = `img[alt="${altText}"]`;
  const divContainingImage = $(jqueryStringForImage).parent();
  const succeedingDiv = divContainingImage.next();
  const value: string = succeedingDiv.find("h2").text().trim();
  return value;
}
