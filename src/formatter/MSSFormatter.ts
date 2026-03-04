import { parseHTMLResults } from "../parser/MSSParser";

export type MSSResponse = {
  highTemp: string;
  lowTemp: string;
  timestamp: string;
};

/**
 * I kinda just wanted to un-bloat the main controller method. This function doesn't really do much it is just verbose.
 * If I want to change the MSSResponse
 * @param highTempParsed
 * @param lowTempParsed
 * @returns
 */
export function formatResponse(highTempParsed: parseHTMLResults, lowTempParsed: parseHTMLResults): MSSResponse {
  let highTemp: string;
  let lowTemp: string;
  if (highTempParsed.time) {
    highTemp = `High temp: ${highTempParsed.value} at ${highTempParsed.location} at time ${highTempParsed.time}`;
  } else {
    highTemp = `High temp: ${highTempParsed.value} at ${highTempParsed.location}`;
  }
  if (lowTempParsed.time) {
    lowTemp = `Low temp: ${lowTempParsed.value} at ${lowTempParsed.location} at time ${lowTempParsed.time}`;
  } else {
    lowTemp = `Low temp: ${lowTempParsed.value} at ${lowTempParsed.location}`;
  }
  const result = {
    highTemp,
    lowTemp,
    timestamp: new Date().toLocaleString(),
  };
  return result;
}
