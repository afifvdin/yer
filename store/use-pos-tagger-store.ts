import { TCorpus, ITagset, ITag } from "@/lib/types"
import { getRandomTagColor } from "@/lib/utils"
import { create } from "zustand"

export interface POSTaggerState {
  corpusExist: boolean
  activeDocumentIndex: number
  incrementCountTags: number
  tagset: ITagset
  corpus: TCorpus
  setTagset: (tagset: ITagset) => void
  setTag: (index: number, tagId: number) => void
  prev: () => void
  next: () => void
  jump: (index: number) => void
  setCorpus: (corpus: TCorpus) => void
  addTags: (tags: string[]) => void
  removeTag: (id: number) => void
  updateTag: (id: number, tag: ITag) => void
  resetTagset: () => void
}

export const usePosTaggerStore = create<POSTaggerState>((set, get) => ({
  corpusExist: false,
  activeDocumentIndex: 0,
  incrementCountTags: 0,
  tagset: {},
  corpus: [],
  setTag: (index, tagId) => {
    let newCorpus = [...get().corpus]
    let activeDocumentIndex = get().activeDocumentIndex
    let newDocument = [...newCorpus[activeDocumentIndex]]
    newDocument[index].tagId = tagId
    newCorpus[activeDocumentIndex] = newDocument
    set((_) => ({
      corpus: newCorpus,
    }))
  },
  prev: () => {
    let length = get().corpus.length
    let index = get().activeDocumentIndex
    if (length === 0 || index === 0) return
    set({ activeDocumentIndex: index - 1 })
  },
  next: () => {
    let length = get().corpus.length
    let index = get().activeDocumentIndex
    if (length === 0 || index === length - 1) return
    set({ activeDocumentIndex: index + 1 })
  },
  jump: (index) => set((state) => ({ activeDocumentIndex: index })),
  setCorpus: (corpus) => set({ corpus, corpusExist: true }),
  setTagset: (tagset) => {
    let nextIncrement = Math.max.apply(
      Math,
      Object.keys(tagset).map((id) => parseInt(id))
    )
    set({ tagset, incrementCountTags: nextIncrement })
  },
  addTags: (tags) => {
    let moreTagset: ITagset = {}
    for (let i = 0; i < tags.length; i++) {
      moreTagset[get().incrementCountTags + 1 + i] = {
        name: tags[i],
        colorId: getRandomTagColor(),
      }
    }
    set((state) => ({
      tagset: { ...state.tagset, ...moreTagset },
      incrementCountTags: state.incrementCountTags + tags.length,
    }))
  },
  removeTag: (id) => {
    let newTagset = { ...get().tagset }
    delete newTagset[id]
    set((_) => ({ tagset: newTagset }))
  },
  updateTag: (id, tag) =>
    set((state) => ({ tagset: { ...state.tagset, [id]: tag } })),
  resetTagset: () => set((_) => ({ tagset: {} })),
}))
