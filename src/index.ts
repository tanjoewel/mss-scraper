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
    const img1 = $("img[alt='highest temperature recorded today']")
    const divContainingHigh = img1.parent().next(); // maybe cheerio-rize it again and then get the h4 inside it?
    // i think instead of just getting all the children and the text and processing it using string functions i should get the h4 which contains the temperature, and the p element which contains the location
    const highTempValue: string = divContainingHigh.find("h4").text().trim();
    // const highTempp = divContainingHigh.find("p").text(); // for some reason even though there is a </br> in the raw HTML, splitting it by \n doesn't work.
    const highTempp: string | null = divContainingHigh.find("p").html();
    const highTemppArr: string[] = highTempp!.split("<br>"); // handle the case where it is null in the future - needs special consideration such as formatting the response appropriately
    const highTempLocation: string = highTemppArr[0].trim();
    const highTempTime: string = highTemppArr[1].trim();
    highTemp = `High temp: ${highTempValue} at ${highTempLocation} at time ${highTempTime}`;
    // highTemp = highTempRaw.text(); // then need to process this text
    const img2 = $("img[alt='lowest temperature recorded today']")
    const lowTempRaw = $(img2.parent().next()).children().text();
    lowTemp = lowTempRaw;
    const result = {
      highTemp,
      lowTemp,
      timestamp: new Date().toISOString(),
    };
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("Error fetching response from MSS website");
  }
});
