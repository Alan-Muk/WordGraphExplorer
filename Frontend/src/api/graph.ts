import type {
  GraphResponse,
  PathResponse,
  SimilarityResponse,
  SearchResponse,
} from "../types/graph";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/**
 * Throws an `Error` with a human-readable message for the common cases:
 * 404 (not found), other non-OK statuses, network failure, and invalid JSON.
 */
async function request<T>(url: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Cannot reach the server");
  }

  if (response.status === 404) {
    throw new Error("Not found");
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Invalid response from server");
  }
}

export async function fetchGraph(
  word: string,
  depth = 2,
): Promise<GraphResponse> {
  return request<GraphResponse>(
    `${API}/graph/${encodeURIComponent(word)}?depth=${depth}`,
  );
}

export async function fetchPath(
  from: string,
  to: string,
): Promise<PathResponse> {
  const params = new URLSearchParams({ from, to });
  return request<PathResponse>(`${API}/path?${params}`);
}

export async function fetchSimilarity(
  from: string,
  to: string,
): Promise<SimilarityResponse> {
  const params = new URLSearchParams({ from, to });
  return request<SimilarityResponse>(`${API}/similarity?${params}`);
}

export async function searchWord(word: string): Promise<SearchResponse> {
  const params = new URLSearchParams({ word });
  return request<SearchResponse>(`${API}/search?${params}`);
}
