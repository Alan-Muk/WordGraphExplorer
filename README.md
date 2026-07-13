# Word Graph

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![ConceptNet](https://img.shields.io/badge/API-ConceptNet-orange)
![Graph Algorithms](https://img.shields.io/badge/Algorithms-Dijkstra-blueviolet)

A semantic graph exploration platform that transforms natural language concepts into interactive knowledge graphs using ConceptNet, weighted graph modeling, and shortest-path algorithms.

The system enables users to explore relationships between concepts, discover semantic connections, and visualize reasoning paths through an interactive graph interface.

---

# Overview

Word Graph is a full-stack semantic reasoning system built around dynamically generated knowledge graphs.

The system workflow:

```text
Concept Input
      |
      ↓
ConceptNet API
      |
      ↓
Graph Construction
      |
      ↓
Weighted Knowledge Graph
      |
      ↓
Dijkstra Pathfinding
      |
      ↓
Interactive Visualization
```

The goal is to represent semantic relationships as a navigable graph where concepts can be connected, analyzed, and explored through graph algorithms.

---

# Problem

Understanding relationships between concepts requires more than simple keyword matching.

Traditional search systems identify related words but often fail to explain:

- Why concepts are connected
- How concepts relate through intermediate ideas
- Which path represents the strongest semantic relationship

Word Graph addresses this by modeling concepts as weighted graphs and applying graph traversal algorithms to discover meaningful paths.

---

# Architecture

## System Architecture

```text
React + TypeScript Client
          |
          |
      Express API
          |
          |
   Graph Processing Engine
          |
          |
   ConceptNet Knowledge Graph
```

---

# Components

## Frontend

Built with React and Vite.

Responsibilities:

- Interactive graph visualization
- User input handling
- Path animation
- Graph exploration interface

Technologies:

- React
- TypeScript
- Cytoscape.js
- Vite

---

## Backend

Built with Node.js and Express.

Responsibilities:

- Fetch semantic relationships
- Construct graph structures
- Provide graph and pathfinding APIs
- Handle caching and retries

API endpoints:

### Build Semantic Graph

```
GET /graph/:word
```

Example response:

```json
{
  "nodes": [],
  "edges": []
}
```

---

### Find Semantic Path

```
GET /path?from=word1&to=word2
```

Example response:

```json
{
  "from": "dog",
  "to": "zoo",
  "path": [
    "dog",
    "animal",
    "zoo"
  ]
}
```

---

# Core Features

## Dynamic Graph Construction

- Expands concepts using the ConceptNet API
- Builds multi-hop semantic graphs
- Filters irrelevant relationships
- Creates navigable graph structures

---

## Weighted Semantic Relationships

Relationships are assigned weights based on semantic strength.

Example:

| Relationship | Weight |
|---|---:|
| IsA | 1 |
| UsedFor | 2 |
| CapableOf | 2 |
| HasProperty | 2 |
| PartOf | 3 |
| Causes | 3 |
| RelatedTo | 5 |

Lower weights represent stronger semantic connections.

---

## Graph Pathfinding

The system uses Dijkstra's shortest path algorithm to determine the lowest-cost semantic path between concepts.

Example:

```text
dog
 |
animal
 |
zoo
```

The result represents the shortest semantic relationship path discovered by the graph engine.

---

## Interactive Visualization

The frontend uses Cytoscape.js to:

- Render dynamic graphs
- Display concept relationships
- Highlight computed paths
- Animate traversal steps
- Center the view around active nodes

---

# Technical Highlights

- Built a dynamic semantic graph generation engine
- Implemented weighted graph traversal algorithms
- Designed recursive graph expansion with depth limits
- Added API caching and retry handling
- Created bidirectional graph representations
- Built interactive visualization for algorithm explanations

---

# Design Decisions

## Weighted Graph Model

Not all semantic relationships have equal meaning.

The system assigns different costs to relationships to prioritize stronger connections.

Example:

```
dog → animal
```

has a stronger semantic relationship than:

```
dog → related concept
```

---

## Recursive Graph Expansion

The graph builder expands concepts recursively while controlling:

- Maximum traversal depth
- API usage
- Graph size

This balances exploration depth with performance.

---

## Caching Strategy

External API requests are cached to:

- Reduce repeated ConceptNet calls
- Improve response time
- Increase reliability

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Cytoscape.js

## Backend

- Node.js
- Express
- Axios

## Data Source

- ConceptNet API

## Algorithms

- Graph traversal
- Weighted graphs
- Dijkstra shortest path

---

# How It Works

1. User enters a concept.
2. Backend requests related concepts from ConceptNet.
3. The graph builder converts relationships into nodes and edges.
4. Relationships receive semantic weights.
5. Dijkstra's algorithm calculates the lowest-cost path.
6. React visualizes the resulting graph and reasoning path.

---

# Example Use Cases

- Semantic relationship exploration
- Knowledge graph visualization
- Educational graph algorithm demonstrations
- Graph-based AI preprocessing
- GraphRAG-style experimentation

---

# Challenges

## Large Graph Expansion

Expanding concepts can quickly create large graphs.

Solution:

- Depth-limited traversal
- Relationship filtering
- Caching

---

## Semantic Ranking

Different ConceptNet relationships have different meanings.

Solution:

- Custom relationship weighting system
- Priority-based traversal

---

## Visualization Performance

Large graphs can become difficult to navigate.

Solution:

- Interactive rendering
- Selective path highlighting
- Dynamic graph updates

---

# Future Improvements

- Add LRU/TTL cache management
- Implement A* pathfinding
- Add human-readable edge explanations
- Introduce streaming graph updates
- Add AI-generated semantic explanations
- Improve graph ranking algorithms

---

# Running Locally

## Clone Repository

```bash
git clone https://github.com/Alan-Muk/Word-Graph
cd Word-Graph
```

---

## Install Dependencies

Backend:

```bash
cd server
npm install
```

Frontend:

```bash
cd client
npm install
```

---

## Start Backend

```bash
npm run dev
```

Backend runs on:

```
http://localhost:3001
```

---

## Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# License

MIT License
