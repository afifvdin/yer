import { toast } from "sonner";
import { useStore } from "@/stores/use-store";

export function Export() {
  const sentences = useStore((state) => state.sentences);
  const tagset = useStore((state) => state.tagset);

  const handleExport = () => {
    const words = sentences.map((document) => {
      return document.words.map((word) => {
        return [word.word, word.tagId];
      });
    });
    const yer = {
      tagset,
    };
    const data = JSON.stringify({ yer, words });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "yer.json";
    link.click();
    URL.revokeObjectURL(url);
    toast("File downloaded as yer.json");
  };

  return (
    <button className="cursor-pointer underline" onClick={handleExport}>
      Export
    </button>
  );
}
