import express from "express";
import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

import { queryForecast, getHighestLowestTemperatureResult, queryHighestLowestTemperature, queryHighestLowestRainfall } from "./parser/MSSParser";
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

    const highTempParsed: getHighestLowestTemperatureResult = queryHighestLowestTemperature("highest temperature recorded today", $);
    const lowTempParsed: getHighestLowestTemperatureResult = queryHighestLowestTemperature("lowest temperature recorded today", $);

    const result: MSSResponse = formatResponse(highTempParsed, lowTempParsed);

    const highForecast: string = queryForecast("Forecast maximum", $);
    const lowForecast: string = queryForecast("Forecast minimum temperature", $);
    console.log("highForecast: ", highForecast, "\nlowForecast: ", lowForecast);

    const highestRainfall: any = queryHighestLowestRainfall("highest rainfall recorded today", $);
    console.log("Highest rainfall: ", highestRainfall);

    res.send(result);
    // res.send("hi");
  } catch (err) {
    console.log(err);
    res.send("Error fetching response from MSS website");
  }
});
