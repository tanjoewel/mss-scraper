import express from "express";
import Axios, { AxiosResponse } from "axios";
import * as cheerio from "cheerio";

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
    // console.log($);
    let highTemp: string = "";
    let lowTemp: string = "";

    const highTempParsed: parseHTMLResults = queryHighestLowestValuesMSS("highest temperature recorded today", $);
    const lowTempParsed: parseHTMLResults = queryHighestLowestValuesMSS("lowest temperature recorded today", $);

    highTemp = `High temp: ${highTempParsed.value} at ${highTempParsed.location} at time ${highTempParsed.time}`;
    lowTemp = `Low temp: ${lowTempParsed.value} at ${lowTempParsed.location} at time ${lowTempParsed.time}`;
    const result = {
      highTemp,
      lowTemp,
      timestamp: new Date().toLocaleString(),
    };
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("Error fetching response from MSS website");
  }
});

interface parseHTMLResults {
  value: string;
  location: string;
  time: string;
}

/**
 * Not sure if this is the best way to abstract this out, but this should at least be a work in progress.
 * This function (currently) takes in the cheerio.CheerioAPI and an alt text, and parses using a very specific structure.
 * Specifically, it finds an image with the given alt text, then finds the div immediately after the div encompassing the image.
 * This div contains a h4 with the value, and a p element with the location and time separated by a <br/> element
 * @param altText alt text of image
 * Returns a formatted string (for now), not ideal i think
 */
function queryHighestLowestValuesMSS(altText: string, $: cheerio.CheerioAPI): parseHTMLResults {
  const jqueryStringForImage: string = `img[alt="${altText}"]`
  const divContainingImage = $(jqueryStringForImage).parent();
  const succeedingDiv = divContainingImage.next();
  const value: string = succeedingDiv.find("h4").text().trim();
  const pElement: string | null = succeedingDiv.find("p").html();
  const pArr: string[] = pElement!.split("<br>"); // handle the case where it is null in the future - needs special consideration such as formatting the response appropriately, and also idk if it is a good idea to just split like this it might break if the format changes (although everything will break if the format changes)
  const location: string = pArr[0].trim();
  const time: string = pArr[1].trim();
  return {value, location, time};
}
