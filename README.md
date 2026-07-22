# WordGraphExplorer

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![WordNet](https://img.shields.io/badge/Data-WordNet-orange)
![Cytoscape](https://img.shields.io/badge/Visualization-Cytoscape.js-111111)
![Graph Algorithms](https://img.shields.io/badge/Algorithms-Dijkstra-blueviolet)
![Tests](https://img.shields.io/badge/Tests-Vitest-6E9F18)

A semantic graph exploration platform that transforms words into interactive knowledge graphs using WordNet, weighted graph modelling, and graph traversal algorithms.

WordGraphExplorer allows users to explore lexical relationships, navigate semantic hierarchies, discover connections between concepts, and interact with dynamically expanding graph structures.

---

# Overview

WordGraphExplorer is a full-stack semantic reasoning system built around WordNet data.

Instead of treating words as isolated strings, the system represents concepts as a graph:

- Words and synsets become graph nodes
- Semantic relationships become weighted edges
- Graph algorithms discover connections and paths
- The frontend provides interactive exploration

## System Workflow

```text
Word Input
    |
    ↓
WordNet Lookup
    |
    ↓
Synset Expansion
    |
    ↓
Semantic Graph Construction
    |
    ↓
Weighted Graph Model
    |
    ↓
Graph Algorithms
    |
    ↓
Interactive Visualization
```

---

# Problem

Understanding language relationships requires more than keyword matching.

Traditional search systems can find terms but often fail to explain:

- How concepts are related
- Which concepts belong to broader categories
- How words connect through semantic hierarchies
- What path exists between two concepts

WordGraphExplorer models language as a graph structure, enabling semantic traversal, pathfinding, and relationship analysis.

---

# Architecture

```text
React + TypeScript Client
          |
          |
     Express API
          |
          |
 Semantic Graph Engine
          |
          |
     WordNet Database
```

## Frontend

Built with React, TypeScript, and Vite.

Responsibilities:

- Interactive semantic graph visualization
- Node exploration
- Relationship highlighting
- Graph expansion
- Definition display
- Semantic navigation

Technologies:

- React
- TypeScript
- Vite
- Cytoscape.js
- Cytoscape Cola Layout

---

## Backend

Built with Node.js, Express, and TypeScript.

Responsibilities:

- WordNet lookup
- Synset expansion
- Semantic graph construction
- Relationship modelling
- Pathfinding
- Similarity calculation

Technologies:

- Node.js
- Express
- TypeScript

---

# API

## Build Semantic Graph

```
GET /graph/:word
```

Example:

```
GET /graph/dog
```

Response:

```json
{
  "word": "dog",
  "nodes": [
    {
      "id": "2084071.noun",
      "label": "dog"
    }
  ],
  "edges": [],
  "stats": {
    "nodes": 30,
    "edges": 56
  }
}
```

---

## Find Semantic Path

```
GET /path?from=word1&to=word2
```

Example:

```
GET /path?from=dog&to=animal
```

Response:

```json
{
  "start": "dog",
  "end": "animal",
  "path": [
    "2084071.noun",
    "1317541.noun"
  ],
  "distance": 1
}
```

---

## Calculate Similarity

```
GET /similarity?from=word1&to=word2
```

Example:

```
GET /similarity?from=dog&to=animal
```

Response:

```json
{
  "from": "dog",
  "to": "animal",
  "distance": 1,
  "similarity": 0.5,
  "path": [
    "2084071.noun",
    "1317541.noun"
  ]
}
```

---

# Core Features

## Dynamic Semantic Graph Construction

The backend converts WordNet synsets into graph structures.

Features:

- Recursive graph expansion
- Depth-controlled traversal
- Synset-based node modelling
- Relationship-aware edges
- Graph integrity validation

---

## Semantic Relationships

WordNet relationships are represented as graph edges.

| Relationship | Meaning |
|---|---|
| Hypernym | Broader concept |
| Hyponym | More specific concept |
| Meronym | Part relationship |
| Holonym | Whole relationship |
| Antonym | Opposite meaning |

Edges are weighted according to relationship strength, allowing algorithms to prioritise meaningful connections.

---

## Graph Pathfinding

The graph engine uses Dijkstra's algorithm to discover semantic paths.

Example:

```text
dog
 |
domestic_animal
```

The algorithm calculates the lowest-cost route between concepts based on relationship weights.

---

## Interactive Visualization

The frontend uses Cytoscape.js to provide:

- Network-style graph rendering
- Relationship colour coding
- Node selection
- Neighbour highlighting
- Local graph expansion
- Dynamic exploration

Example:

```text
             canine

                |
                |

puppy ---- dog ---- domestic_animal

                |
              poodle
```

---

# Technical Highlights

- Built a semantic graph engine from WordNet data
- Implemented weighted graph structures
- Created recursive graph expansion
- Implemented Dijkstra shortest path search
- Added semantic similarity scoring
- Built an interactive Cytoscape graph explorer
- Added local node expansion without rebuilding the graph
- Designed a modular TypeScript backend architecture

---

# Design Decisions

## Graph-Based Language Representation

Words are represented as nodes rather than isolated strings.

This enables:

- Relationship traversal
- Hierarchical exploration
- Semantic distance calculations
- Knowledge graph experimentation

---

## Weighted Relationships

Not every relationship has equal meaning.

Example:

```
dog → animal
```

is a stronger semantic connection than unrelated associations.

Relationship weights allow graph algorithms to prioritise meaningful paths.

---

## Local Graph Expansion

Large semantic graphs quickly become difficult to navigate.

The explorer expands concepts locally:

```text
Double click node
        |
        ↓
Fetch neighbours
        |
        ↓
Add concepts
        |
        ↓
Continue exploring
```

This keeps visualisation manageable while allowing discovery.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Cytoscape.js
- Cytoscape Cola Layout

## Backend

- Node.js
- Express
- TypeScript

## Data Source

- WordNet

## Algorithms

- Graph traversal
- Weighted graphs
- Dijkstra shortest path
- Similarity scoring

---

# How It Works

1. User enters a word
2. Backend queries WordNet
3. Synsets are converted into graph nodes
4. Semantic relationships become weighted edges
5. Graph algorithms analyse connections
6. React renders the interactive graph
7. Users expand and explore related concepts

---

# Example Exploration

Starting from:

```
dog
```

The explorer discovers:

```
dog

├── canine
├── domestic_animal
├── puppy
├── poodle
└── hunting_dog
```

Users can continue expanding individual concepts.

---

# Example Use Cases

- Semantic exploration
- Knowledge graph visualization
- Educational graph algorithm demonstrations
- Linguistic analysis
- Graph-based AI experiments
- GraphRAG research prototypes

---

# Challenges

## Graph Growth

Semantic graphs can quickly become large.

Solution:

- Depth limits
- Local expansion
- Selective traversal

---

## Semantic Relationships

Language relationships are not equally meaningful.

Solution:

- Relationship weighting
- Graph-based ranking
- Path scoring

---

## Visualization Complexity

Large graphs become difficult to interpret.

Solution:

- Interactive exploration
- Node highlighting
- Local expansion
- Relationship colouring

---

# Testing

The backend includes automated tests covering the core graph engine and semantic operations.

Test coverage includes:

- WordNet lookup
- Semantic graph expansion
- Graph construction
- Edge integrity validation
- Relationship handling
- Priority queue behaviour
- Dijkstra shortest path
- Semantic similarity scoring

---

# Future Improvements

- Add edge explanation tooltips
- Add graph export/import
- Add A* pathfinding
- Add embeddings for semantic similarity
- Add graph persistence
- Add AI-generated explanations
- Improve ranking algorithms

---

# Running Locally

## Clone Repository

```bash
git clone https://github.com/Alan-Muk/WordGraphExplorer

cd WordGraphExplorer
```

## Install Dependencies

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd Frontend
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
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

<img width="1366" height="768" alt="Screenshot From 2026-07-22 14-21-10" src="https://github.com/user-attachments/assets/897593c3-7a9a-434b-8a2f-8030ec7d890b" />
<img width="1366" height="768" alt="Screenshot From 2026-07-22 14-20-46" src="https://github.com/user-attachments/assets/9325ffb2-4213-4405-9222-3eeed5faed77" />
<img width="1366" height="768" alt="Screenshot From 2026-07-22 14-20-39" src="https://github.com/user-attachments/assets/04227fa8-b798-422d-9294-364e7318a0ad" />


---

# License

MIT License
