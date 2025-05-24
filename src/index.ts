import express from "express";
import Axios from "axios";
import * as cheerio from "cheerio";

const app = express();

const MSSHomepageURL: string = "https://www.weather.gov.sg/home/";

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

app.get("/", async (req, res) => {
  try {
    const GetResponse = await Axios.get(MSSHomepageURL);
    const data = GetResponse.data;
    const $ = cheerio.load(data);
    console.log($);
    let highTemp = "";
    let lowTemp = "";

    // Adjust selectors based on the actual HTML structure
    $("div").each((_, el) => {
      const text = $(el).text().trim();
      if (text.includes("High")) {
        highTemp = text;
      } else if (text.includes("Low")) {
        lowTemp = text;
      }
    });

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
