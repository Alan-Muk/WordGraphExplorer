import { test, expect } from "vitest";

import { WordNetService } from "../services/WordNetService";
import { GraphBuilder } from "../graph/builder";
import { dijkstra } from "../engine/Djikstra";


test(
"expands WordNet graph",
async () => {

 const service =
   new WordNetService();

 const synsets =
   await service.expand(
     "dog",
     5
   );


 expect(
   synsets.length
 )
 .toBeGreaterThan(1);

});