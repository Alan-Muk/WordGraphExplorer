# Frontend

React + Vite + Cytoscape.js client for WordGraphExplorer. Renders the
backend's semantic graph in three interactive views.

## The three views

### Explore — grouped relations

Two states:

- **Landing**: the root word plus one top-ranked child per relation type.
  Small and focused — you always see the same number of nodes, no matter how
  many hyponyms the word has.
- **Focused**: click a relation in the legend to see all its nodes (capped
  at 30 by the backend).

Single-click a node opens an info panel. Double-click navigates to that word.
A breadcrumb tracks the sequence of words and relations you've walked.

### Tree — radial hierarchy

A depth-4 radial layout of the concept hierarchy. Root at the center, children
arranged in rings by depth. Edges colored by relation type. Click any node to
jump back to its Explore view.

### Path — semantic route between two words

![Path view](./docs/screenshot-path.png)

Enter two words and pick an algorithm (Dijkstra or BFS). The path renders
left-to-right with endpoints highlighted. A banner shows distance and
similarity. The breadcrumb shows the path's steps; clicking one exits to
Explore.

## Interaction model

| Gesture | Result |
|---|---|
| Single-click a node | Open the info panel |
| Double-click a node | Navigate to that word |
| Click a legend row | Focus that relation (grouped) |
| Click the active legend row | Return to landing |
| Click a breadcrumb step | Rewind to that point |
| "⤢ Full tree" button | Enter tree view |
| "← Back to browse" | Exit tree view |
| Drag the canvas | Pan |
| Scroll | Zoom |

Nodes are not draggable (`autoungrabify: true`), so clicks register cleanly.
Single vs. double-click is distinguished with a 250ms timeout on the `tap`
event.

## Architecture

```text
App.tsx — owns history, view mode, selected node
├── Toolbar (mode select, inputs, algorithms)
├── Breadcrumb (word/relation trail or path steps)
├── GroupedGraphCanvas ← Cytoscape, landing/focused views
├── TreeView ← Cytoscape, radial layout
├── PathView ← Cytoscape, left-to-right
├── NodePanel ← info panel (label, definition, explore button)
└── Legend ← relation selector (grouped mode only)
```

State lives in `App.tsx`:

- `history: Step[]` — the word/relation trail. The current word and active
  relation are derived from its last entries.
- `view: "grouped" | "tree" | "path"` — which canvas renders.
- `data`, `treeData`, `pathData` — the fetched results for each view.
- `selected` — the node currently in the info panel.

Data fetching lives in `api/graph.ts`. Each view has its own `fetch*`
function; the responses are typed in `types/graph.ts`.

## Components

| File | Responsibility |
|---|---|
| `App.tsx` | Top-level state and view dispatch |
| `Toolbar.tsx` | Search input, mode select, path inputs |
| `Legend.tsx` | Clickable relation list (interactive in grouped mode) |
| `Breadcrumb.tsx` | Trail of steps; clicking rewinds |
| `GroupedGraphCanvas.tsx` | Landing + focused Cytoscape rendering |
| `TreeView.tsx` | Radial Cytoscape rendering, layer-based node sizing |
| `PathView.tsx` | Left-to-right path rendering |
| `NodePanel.tsx` | Info panel for the selected node |

## Styling

All styles are in `App.css`. Overlays (toolbar, legend, breadcrumb, panel) are
absolutely positioned over a full-viewport canvas. Colors are defined in
`constants/relations.ts` and shared between the legend, the graph edges, and
the node panel's relation labels.

## Testing

```bash
npm test
```

3 files, 11 tests. Breadcrumb, Legend, and App are covered. App's
test mocks the API module and the Cytoscape components, since jsdom has no
canvas.

## Build

```bash
npm run build
```

| Asset | Size | Gzipped |
|---|---|---|
| JS | 724.58 kB | 225.81 kB |
| CSS | 3.87 kB | 1.17 kB |
| HTML | 0.45 kB | 0.29 kB |

The JS bundle is dominated by Cytoscape (~400 kB) plus React. Vite warns
about the chunk size — it's expected for a graph-heavy app. Lazy-loading the
tree and path views would cut the initial bundle in half, but isn't necessary
for the current feature set.

## Metrics

| Metric | Value |
|---|---|
| TypeScript/TSX | 1,543 lines, 12 components |
| Test files | 3 |
| Tests | 11 |
| Build size (gzipped JS) | 225.81 kB |

## License

MIT