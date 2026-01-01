import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { ParsingError, ParseError } from "./errors";

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

export interface parsePResults {
  isMultipleLocations: boolean;
  array: string[];
}

export interface parseHTMLResults {
  value: string;
  location: string;
  time: string | undefined;
}
