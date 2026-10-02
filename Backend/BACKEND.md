# Backend

Node + Express + TypeScript API that turns WordNet into a queryable semantic
graph.

## Architecture

```text
WordNet raw files (27 MB)
        ↓
SynsetIndex — parses data.{noun,verb,adj,adv} + index.{noun,verb,adj,adv}
        ↓
WordNetService — lookup, expand, rank, relations
        ↓
SemanticGraphService — builds Graph objects, exposes grouped/tree/path views
        ↓
routes/ — Express endpoints
```

## The interesting problem: WordNet's one-level limit

The `wordnet` npm package only inlines pointer data **one level deep**. When
you `lookup("dog")`, its pointers to `canine`, `puppy`, etc. come with full
target data. But `canine`'s pointers come with only an offset and a POS —
no resolved target. So a naive recursive expansion can't go past depth 1.

To unlock real depth, `SynsetIndex` parses WordNet's raw data files directly.
On startup, it reads all four `data.*` files into a `Map<offset.pos, Synset>`,
where each synset's pointers can be resolved by offset via a second lookup.
That makes the walk arbitrary-depth.

The cost is 164 MB of heap — the entire WordNet graph, parsed and indexed.
The benefit is that any synset is reachable in O(1), and a depth-5 expansion
of a common word (8,389 nodes) completes in milliseconds.

## Ranking

Each synset has a **tagsense count** from WordNet's index files (the SemCor
frequency data). Higher = more common sense. We use it to:

- Pick the **top-ranked child** per relation in the tree view and the landing
  view.
- Serve as a secondary sort in the focused group view (degree is primary).

Rank coverage is sparse: only **15%** of the 153,902 lemma+POS entries have a
non-zero count. That's why degree leads in the focused view and rank leads
only when it's meaningfully non-zero.

## Weight model

Edge weights are computed on demand by `Graph.edgeWeight()`:

```text
weight = relationWeight(type) × (1 + 1 / max(1, targetDegree))
```

Where `relationWeight` is a base cost per relation:

- hypernym, hyponym: 1
- meronym, holonym: 2
- antonym: 3
- unknown: 5

A target with degree 1 costs 2× base; degree 10 costs 1.1× base. This makes
Dijkstra prefer paths through well-connected synsets while still respecting
the semantics of the relation type.

BFS ignores weights entirely and finds the shortest hop count. Running both
algorithms on the same pair often produces different paths — Dijkstra's is
usually fewer semantic steps, BFS's is usually fewer hops.

## API

### `GET /graph/:word?view=grouped`

Returns a word's immediate relations, grouped by type. Each group is sorted
by degree, capped at 30 nodes, and includes a `top` field with the highest-
ranked node (used for the landing view).

```bash
curl "http://localhost:3001/graph/dog?view=grouped"
```

```json
{
  "word": "dog",
  "root": { "id": "2084071.noun", "label": "dog", "rank": 1, "definition": "..." },
  "groups": [
    {
      "relation": "hypernym",
      "total": 2,
      "top": { "id": "1317541.noun", "label": "domestic_animal", "rank": 1 },
      "nodes": [ ... ]
    },
    { "relation": "hyponym", "total": 18, "top": { ... }, "nodes": [ ... ] },
    { "relation": "meronym", "total": 2, "top": { ... }, "nodes": [ ... ] },
    { "relation": "holonym", "total": 1, "top": { ... }, "nodes": [ ... ] }
  ]
}
```

### `GET /graph/:word?view=tree&depth=4`

Builds a depth-4 tree where each node picks its single highest-ranked child
per relation. Uses a global visited set to prevent cycles.

```bash
curl "http://localhost:3001/graph/dog?view=tree"
```

Response contains `nodes[]` (with `layer` field), `edges[]`, and the root.
For dog at depth 4: 53 nodes across 5 layers.

### `GET /graph/:word?depth=N`

The full expanded graph at the given depth. Used for exploration and as the
substrate for pathfinding.

```bash
curl "http://localhost:3001/graph/dog?depth=3"
```

| Word | Depth 1 | Depth 3 | Depth 5 |
|---|---|---|---|
| dog | 97 / 127 | 1,200 / 1,740 | 8,389 / 15,632 |
| animal | 132 / 161 | 4,952 / 8,525 | — |

(nodes / edges)

### `GET /path?from=&to=&algorithm=dijkstra|bfs`

Finds the shortest semantic path between two words.

```bash
curl "http://localhost:3001/path?from=dog&to=animal&algorithm=dijkstra"
```

```json
{
  "start": "dog",
  "end": "animal",
  "distance": 1,
  "path": [
    { "id": "2084071.noun", "label": "dog", "definition": "..." },
    { "id": "1317541.noun", "label": "domestic_animal", "definition": "..." }
  ],
  "edges": [
    { "source": "2084071.noun", "target": "1317541.noun", "relation": "hypernym" }
  ]
}
```

`distance` is `null` when no path exists.

### `GET /similarity?from=&to=`

Returns `distance` and `similarity` (`1 / (1 + distance)`).

### `GET /search?word=`

Returns every synset matching the word, across all parts of speech.

## Module map

```text
Backend/
├── config.ts                Default and max depth constants
├── index.ts                 Express app entry
├── engine/
│   ├── BFS.ts               Unweighted shortest hop path
│   ├── DFS.ts               Depth-first traversal
│   ├── Dijkstra.ts          Weighted shortest path
│   ├── Graph.ts             Node/edge container, degree, edgeWeight
│   ├── GraphBuilder.ts      Assembles a Graph from a synset list
│   └── PriorityQueue.ts     Binary min-heap for Dijkstra
├── graph/
│   └── weights.ts           relationWeight() and edgeWeight()
├── models/                  Types: Synset, GraphNode, GraphEdge, etc.
├── routes/                  Express route handlers
├── services/
│   ├── CacheService.ts      Promise-sharing in-memory cache
│   ├── SemanticGraphService.ts  grouped(), tree(), path()
│   ├── SimilarityService.ts     compare()
│   ├── SynsetIndex.ts       Parses WordNet data + index files
│   ├── WordNetService.ts    lookup(), expand(), rank(), relations()
│   └── wordnetRelations.ts  Pointer-symbol → RelationType mapping
├── tests/                   15 files, 37 tests
└── util/                    normalise(), findNodeByLabel()
```

## Testing

```bash
npm test
```

15 files, 37 tests. Covers the graph engine (Dijkstra, BFS, priority queue,
weights), the services (grouped, tree, path, similarity), the WordNet layer
(lookup, expand, rank), and route integration tests.

## Metrics

| Metric | Value |
|---|---|
| TypeScript | 2,562 lines, 55 files |
| WordNet data parsed | 27 MB |
| Synsets in memory | 117,659 |
| Rank entries | 153,902 (15% non-zero) |
| Heap footprint | ~164 MB |
| Cold index load | ~1.6 s |
| Cached graph response | ~13 ms |
| Pointer symbols mapped | 11 of ~30 |
| Relation types | 5 |

## License

MIT