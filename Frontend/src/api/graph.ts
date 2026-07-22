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