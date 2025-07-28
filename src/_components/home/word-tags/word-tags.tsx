import React from "react";
import { WordTag } from "./word-tag";
import { useStore } from "@/stores/use-store";

export const WordTags = React.memo(() => {
  const currentSentence = useStore((state) => state.getCurrentSentence());

  if (!currentSentence) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 self-center p-8">
      {currentSentence.words.map((word, i) => (
        <WordTag key={`${word.word}-${i}`} index={i} word={word} />
      ))}
    </div>
  );
});
