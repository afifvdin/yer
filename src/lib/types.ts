export interface ITag {
  tag: string;
  colorId: number;
}

export interface ITagset {
  [tagId: string]: ITag;
}

export interface IWord {
  word: string;
  tagId: string;
}

export interface ISentence {
  sentence: string;
  words: IWord[];
}
