/**
 * I am not ambitious enough to make a general HTML parser just yet, so there will be a lot of hardcoding of strings and assumptions made that is specific to the MSS website.
 */
export class MSSParser {

}

export interface parsePResults {
  isMultipleLocations: boolean;
  array: string[]
}

export interface parseHTMLResults {
  value: string;
  location: string;
  time: string | undefined;
}
