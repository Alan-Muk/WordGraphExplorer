import axios from "axios";

const BASE_URL = "https://api.conceptnet.io";

// in-memory cache
const cache = new Map<string, any>();

// simple sleep helper
const sleep = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

async function fetchWithRetry(url: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await axios.get(url, {
        timeout: 8000,
        headers: {
          "User-Agent": "word-graph-backend/1.0"
        }
      });

      return res.data;
    } catch (err) {
      if (i === retries) throw err;

      console.warn(`ConceptNet retry ${i + 1}/${retries + 1}`);

      // exponential backoff
      await sleep(500 * Math.pow(2, i));
    }
  }
}

export async function fetchNode(word: string) {
  const key = word.toLowerCase();

  // 1. cache hit
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    // 2. API call
    const url = `${BASE_URL}/query?start=/c/en/${key}&limit=50`;

    const data = await fetchWithRetry(url, 2);

    // 3. store cache
    cache.set(key, data);

    return data;
  } catch (err) {
    console.error("ConceptNet failed permanently for:", word);

    // 4. fallback (NEVER break graph pipeline)
    const fallback = {
      edges: [],
      error: true,
      word: key
    };

    cache.set(key, fallback);
    return fallback;
  }
}

/* --------------------------------------------------------------------------
 * End of ConceptNet API client
 *
 * Module summary:
 * - Retrieves ConceptNet data with automatic retry logic.
 * - Uses exponential backoff for transient request failures.
 * - Caches responses in memory to reduce repeated API calls.
 * - Returns a fallback object on permanent failure to keep the
 *   graph pipeline operational.
 *
 * -------------------------------------------------------------------------- */
