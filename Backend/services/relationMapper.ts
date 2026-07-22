import { RelationType } from "../models/Relations";

export function mapPointer(
  symbol: string
): RelationType | null {

  switch(symbol) {

    case "@":
      return "hypernym";

    case "~":
      return "hyponym";

    case "#m":
      return "meronym";

    case "%p":
      return "holonym";

    default:
      return null;
  }
}