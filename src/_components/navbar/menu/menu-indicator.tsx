import { useStore } from "@/stores/use-store";

export function MenuIndicator({ setOpen }: { setOpen: (v: boolean) => void }) {
  const selectedSentenceId = useStore((state) => state.selectedSentenceId);
  const documentsLength = useStore((state) => state.getSentencesLength());
  return (
    <button className="cursor-pointer underline" onClick={() => setOpen(true)}>
      Sentence {selectedSentenceId + 1} of {documentsLength}
    </button>
  );
}
