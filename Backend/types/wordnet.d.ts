declare module "wordnet" {
  interface WordNetWord {
    word: string;
    lexId: number;
  }

  interface WordNetPointer {
    pointerSymbol: string;
    synsetOffset: number;
    pos: string;
    sourceTargetHex: string;
    data?: WordNetSense; // optional — only present for some pointers
  }

  interface WordNetMeta {
    synsetOffset: number;
    lexFilenum: number;
    synsetType: string;
    wordCount: number;
    words: WordNetWord[];
    pointerCount: number;
    pointers: WordNetPointer[];
  }

  interface WordNetSense {
    glossary: string;
    meta: WordNetMeta;
  }

  interface WordNet {
    init(databaseDir?: string): Promise<void>;
    lookup(word: string, skipPointers?: boolean): Promise<WordNetSense[]>;
  }

  const wordnet: WordNet;
  export default wordnet;
}
