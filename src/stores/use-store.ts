import type { ISentence, ITag, ITagset } from "@/lib/types";

import { create } from "zustand";
import cuid from "cuid";
import { getRandomTagColor } from "@/lib/utils";

export interface IState {
  sentences: ISentence[];
  tagset: ITagset;
  selectedSentenceId: number;
  getSentencesLength: () => number;
  getCurrentSentence: () => ISentence | undefined;
  next: () => void;
  prev: () => void;
  jump: (index: number) => void;
  setWordTag: (index: number, tag: string) => void;
  removeWordTag: (index: number) => void;
  addTags: (tags: string[]) => void;
  updateTag: (tagKey: string, updates: ITag) => void;
  removeTag: (tagKey: string) => void;
  setTagset: (tagset: ITagset) => void;
  setSentences: (sentences: ISentence[]) => void;
}

export const useStore = create<IState>((set, get) => ({
  sentences: [],
  tagset: {},
  selectedSentenceId: 0,

  getSentencesLength: () => get().sentences.length,

  getCurrentSentence: () => {
    const state = get();
    return state.sentences[state.selectedSentenceId];
  },

  next: () => {
    set((state) => {
      const selectedSentenceId = Math.min(
        state.selectedSentenceId + 1,
        state.sentences.length - 1,
      );
      return {
        selectedSentenceId,
      };
    });
  },

  prev: () => {
    set((state) => {
      const selectedSentenceId = Math.max(state.selectedSentenceId - 1, 0);
      return {
        selectedSentenceId,
      };
    });
  },

  jump: (index: number) => {
    set(() => ({
      selectedSentenceId: index,
    }));
  },

  setWordTag: (index: number, tagId: string) => {
    set((state) => {
      if (!state.tagset[tagId]) return state;
      const sentences = [...state.sentences];
      sentences[state.selectedSentenceId].words[index].tagId = tagId;

      return { sentences };
    });
  },

  removeWordTag: (index: number) => {
    set((state) => {
      const sentences = [...state.sentences];
      sentences[state.selectedSentenceId].words[index].tagId = "";

      return { sentences };
    });
  },

  addTags: (tags: string[]) => {
    set((state) => {
      const tagset: ITagset = { ...state.tagset };

      tags.forEach((tag) => {
        const id = cuid();
        if (!tagset[id]) {
          tagset[id] = {
            tag: tag.toUpperCase(),
            colorId: getRandomTagColor(),
          };
        }
      });

      return { tagset };
    });
  },

  updateTag: (id: string, { tag, colorId }: ITag) => {
    set((state) => {
      return {
        tagset: {
          ...state.tagset,
          [id]: {
            tag,
            colorId,
          },
        },
      };
    });
  },

  removeTag: (id: string) => {
    set((state) => {
      const { [id]: removed, ...tagset } = state.tagset;
      return { tagset };
    });
  },

  setTagset: (tagset: ITagset) => set({ tagset }),

  setSentences: (sentences: ISentence[]) =>
    set({
      sentences,
    }),
}));
