declare module "wordnet" {

  interface WordNetSense {
    synsetOffset: number;
    pos: string;
    gloss: string;
    lemma: string;
  }


  interface WordNet {
    lookup(
      word: string,
      callback: (
        results: WordNetSense[]
      ) => void
    ): void;
  }


  const wordnet: WordNet;

  export default wordnet;
}