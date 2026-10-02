# WordGraphExplorer

A semantic knowledge graph explorer over WordNet. Search a word, navigate its
relations, find paths between concepts, and see language as an interconnected
network.


## What it does

WordNet is a lexical database where words are grouped into **synsets** —
sets of synonymous concepts linked by relations like hypernym ("dog is a
canine"), hyponym ("poodle is a dog"), meronym ("a dog has a tail"), and
antonym. It's a graph, not a dictionary.

WordGraphExplorer exposes that graph through three views:

- **Explore** — a word's immediate relations, one group at a time. Click a
  relation to see all of its nodes; click a node to navigate to it.
- **Tree** — a depth-4 radial layout that shows how a concept branches. At
  each level, the highest-ranked child per relation is selected.
- **Path** — find the shortest semantic path between two words using
  Dijkstra or BFS, with a similarity score derived from the path length.

## Features

**Explore**
- Grouped relation view with a landing state (one top-ranked node per
  relation) and a focused state (all nodes in a group, capped at 30).
- Breadcrumb navigation that tracks the word/relation path you've walked.
- Info panel on single-click, navigate on double-click.
- Degree-sorted nodes with WordNet frequency as a secondary signal.

**Tree**
- Depth-4 radial layout of the concept hierarchy.
- Top-ranked child per relation at each level.
- Global visited set to prevent cycles.
- Click any node to jump into its Explore view.

**Path**
- Dijkstra (weighted by relation type and target degree) and BFS
  (unweighted hop count) algorithms.
- Path rendered left-to-right with endpoints highlighted.
- Similarity score: `1 / (1 + distance)`.
- Breadcrumb shows the path; clicking a step exits to Explore.

**Backend**
- Full WordNet index loaded in memory (117,659 synsets, 164 MB heap).
- Relation weights combine semantic type and structural centrality.
- In-memory cache with promise-sharing for concurrent requests.
- 37 tests across 15 files.

## Quick start

Two parts: a Node/Express backend and a React/Vite frontend.

```bash
# Backend — runs on http://localhost:3001
cd Backend
npm install
npm run dev

# Frontend — runs on http://localhost:5173
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173. The first backend request triggers a ~1.6s
WordNet index load; subsequent requests are cached (~13ms).

## Repository layout

```text
WordGraphExplorer/
├── Backend/       Node + Express + TypeScript API over WordNet
├── Frontend/      React + Vite + Cytoscape visualization
└── .github/       CI workflows for both
```

Each part has its own README with architecture and API details:

- [Backend README](Backend/README.md)
- [Frontend README](Frontend/README.md)

## By the numbers

| Metric | Value |
|---|---|
| Total TypeScript | ~4,100 lines |
| Backend | 2,562 lines across 55 files |
| Frontend | 1,543 lines across 12 components |
| WordNet data | 27 MB (8 files) |
| Synsets indexed | 117,659 |
| Lemma + POS rank entries | 153,902 |
| In-memory index | ~164 MB heap |
| API endpoints | 4 |
| Tests | 48 (37 backend, 11 frontend) |

## Tech stack

- **Backend:** Node, Express, TypeScript, WordNet, Vitest
- **Frontend:** React, TypeScript, Vite, Cytoscape.js, Cola layout, Vitest
- **CI:** GitHub Actions (type-check, lint, test, build on both sides)

## License

MIT