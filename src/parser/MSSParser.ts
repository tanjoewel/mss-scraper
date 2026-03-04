import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { ParsingError, ParseError } from "../parsingError";

/**
 * I am not ambitious enough to make a general HTML parser just yet, so there will be a lot of hardcoding of strings and assumptions made that is specific to the MSS website.
 */
export class MSSParser {
  /**
   * The p element can have multiple different variations, so this function is to parse it and to deal with cases where the element may not be structured as expected.
   * Scraping is inherently uncertain! Should never assume that the HTML will be correct...
   * @param element The p element that we want to parse.
   */
  static parsePElement(element: cheerio.Cheerio<Element>): parsePResults {
    try {
      const htmlString: string = this.getHtmlString("parsePElement", element); // this is not good, but the alternative is quite complex so I will leave it at this first.
      // as of 31/12/2025 the webpage says "Few Locations"
      if (htmlString.includes("Location")) {
        return { isMultipleLocations: true, array: [] };
      } else {
        return { isMultipleLocations: false, array: htmlString.split("<br>") };
      }
    } catch (err) {
      // if this error that is being thrown is my custom ParseError, add this step to the stack, otherwise just throw the error again
      if (err instanceof ParseError) {
        throw err.push({
          step: "parsePElement",
        });
      }
      throw err;
    }
  }

  static getHtmlString(source: string, element: cheerio.Cheerio<Element>): string {
    const htmlString: string | null = element.html();
    // if (!htmlString) {
    //   throw new ParsingError(source, "Element provided could not be converted into a HTML string");
    // }
    if (!htmlString) {
      throw new ParseError("Element provided could not be converted into a HTML string").push({
        step: "getHtmlString",
        detail: `Element provided is: ${element.text()}`,
      });
    }
    return htmlString;
  }
}

/**
 * Not sure if this is the best way to abstract this out, but this should at least be a work in progress.
 * This function (currently) takes in the cheerio.CheerioAPI and an alt text, and parses using a very specific structure.
 * Specifically, it finds an image with the given alt text, then finds the div immediately after the div encompassing the image.
 * This div contains a h4 with the value, and a p element with the location and time separated by a <br/> element
 * @param altText alt text of image
 * @param $ the cheerio API
 * Returns a JSON
 */
export function queryHighestLowestTemperature(altText: string, $: cheerio.CheerioAPI): parseHTMLResults {
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
export function queryForecast(altText: string, $: cheerio.CheerioAPI): string {
  const jqueryStringForImage: string = `img[alt="${altText}"]`;
  const divContainingImage = $(jqueryStringForImage).parent();
  const succeedingDiv = divContainingImage.next();
  const value: string = succeedingDiv.find("h2").text().trim();
  return value;
}

export interface parsePResults {
  isMultipleLocations: boolean;
  array: string[];
}

export interface parseHTMLResults {
  value: string;
  location: string;
  time: string | undefined;
}
