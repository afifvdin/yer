export interface IDialog {
  open: boolean
  setOpen: (open: boolean) => void
}

export interface IDialogTagId extends IDialog {
  tag: { id: number; name: string; colorId: number }
}

export interface IWordTag {
  word: string
  tagId: number
}

export interface ITag {
  name: string
  colorId: number
}

export interface ITagset {
  [id: number]: ITag
}

export type TDocument = IWordTag[]

export type TCorpus = TDocument[]
