# Word Graph
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![ConceptNet](https://img.shields.io/badge/API-ConceptNet-orange)
![Graph_Algorithms](https://img.shields.io/badge/Algorithms-Dijkstra-blueviolet)

A semantic graph exploration and reasoning system built on top of ConceptNet, combining knowledge graph construction, weighted graph search, and interactive visualization.

It lets you:

- Explore semantic relationships between words  
- Build multi-hop concept graphs  
- Compute shortest meaning paths between concepts  
- Visualize reasoning steps interactively  

---

## Overview

Word Graph is a full-stack system that turns natural language concepts into a navigable graph:

**Word → ConceptNet API → Graph Builder → Weighted Graph → Dijkstra Pathfinding → Interactive Visualization**

It acts as a lightweight semantic reasoning engine over a dynamically constructed knowledge graph.

---

## Core Features

### Graph Construction
- Expands concepts using the ConceptNet API  
- Filters semantic relationships  
- Builds multi-hop knowledge graphs  

### Semantic Weighting
- Assigns meaning-based weights to relationships  
- Prioritizes stronger semantic connections (e.g. *IsA*) over weaker ones (*RelatedTo*)  

### Pathfinding
- Uses Dijkstra’s algorithm to compute shortest semantic paths  
- Interprets “meaning distance” between concepts  

### Interactive Visualization
- Powered by Cytoscape.js  
- Displays nodes and relationships dynamically  
- Animates semantic paths step-by-step  

---

##  Architecture

### Frontend (React + Vite)
- Graph visualization (Cytoscape.js)  
- Path animation system  
- API client layer  

### Backend (Express)
- `GET /graph/:word` → builds semantic graph  
- `GET /path?from=X&to=Y` → computes shortest path  

### Graph Engine
- Recursive graph expansion (`expandGraph`)  
- Edge filtering (`buildGraph`)  
- Adjacency construction (`buildAdjacency`)  
- Weighted shortest path (`dijkstra`)  

### External Data Source
- ConceptNet API for semantic relationships  

---

## API

### Build Graph
`GET /graph/:word`

{
  "nodes": [...],
  "edges": [...]
}

## Find Semantic Path
GET /path?from=word1&to=word2

Returns:

{
  "from": "dog",
  "to": "zoo",
  "path": ["dog", "animal", "zoo"]
}

## Installation
1. Clone the repo
git clone https://github.com/your-username/word-graph
cd word-graph
2. Install dependencies
Backend:
cd server
npm install
Frontend:
cd client
npm install

## Running the Project
Start backend
cd server
npm run dev

Runs on:

http://localhost:3001
Start frontend
cd client
npm run dev

Runs on:

http://localhost:5173

## Key Concepts
Semantic Graph

Nodes represent concepts, edges represent relationships:

IsA
UsedFor
CapableOf
PartOf
HasProperty
Causes
RelatedTo
Edge Weights
Relation	Weight
IsA	1
UsedFor	2
CapableOf	2
HasProperty	2
PartOf	3
Causes	3
RelatedTo	5

Lower weight = stronger semantic connection.

## Graph Expansion
Recursive exploration of related concepts
Depth-limited traversal
API caching for performance
Pathfinding

Uses Dijkstra’s algorithm to find the lowest-cost semantic path between two concepts.

## Visualization
The frontend uses Cytoscape.js to:
Render semantic graphs
Highlight shortest paths
Animate step-by-step traversal
Center view on active nodes

##  Tech Stack
Frontend
React
Vite
Cytoscape.js
TypeScript
Backend
Node.js
Express
Axios
Data Source
ConceptNet API

##  Design Highlights
Cached API layer with retry logic
Recursive graph expansion with concurrency control
Weighted semantic reasoning model
Bidirectional graph representation
Interactive visual explanation of computed paths

##  Example Use Cases
“How is dog related to zoo?”
Semantic exploration of concepts
Educational visualization of knowledge relationships
AI preprocessing for GraphRAG-style systems

##  Future Improvements
Add LRU/TTL cache for graph expansion
Introduce A* search for faster pathfinding
Add edge explanation layer (human-readable reasoning)
Streaming graph visualization
LLM-powered semantic explanations
