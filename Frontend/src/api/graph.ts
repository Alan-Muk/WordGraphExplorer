const API = "http://localhost:3001";

export async function fetchGraph(
  word: string,
  depth = 2
) {

  const response =
    await fetch(
      `${API}/graph/${word}?depth=${depth}`
    );


  if (!response.ok) {
    throw new Error("Graph fetch failed");
  }


  return response.json();

}


/**
 * Fetches a graph of related words from the API.
 *
 * @param word - The word to use as the starting point of the graph.
 * @param depth - The depth of the graph traversal. Defaults to 2.
 * @returns A promise containing the graph data returned by the API.
 * @throws {Error} If the API request fails.
 */

