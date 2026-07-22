import { RelationType } from "../models/Relations";

export function mapPointer(
  symbol: string
): Relation | null {

  switch (symbol) {

    case "@":
      return "hypernym";

    case "~":
      return "hyponym";

    case "%p":
    case "%m":
    case "%s":
      return "meronym";

    case "#p":
    case "#m":
    case "#s":
      return "holonym";

    case "!":
      return "antonym";

    default:
      return null;
  }

}