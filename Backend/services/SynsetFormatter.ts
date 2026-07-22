import { Synset } from "../models/Synset";


export function formatSynset(
  synset: Synset
) {

  return {

    id: synset.id,

    label: synset.word,

    description:
      synset.definition

  };

}