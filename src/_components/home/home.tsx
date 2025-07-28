import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WordTags } from "./word-tags/word-tags";
import { useEffect } from "react";
import { useStore } from "@/stores/use-store";

export function Home() {
  const next = useStore((state) => state.next);
  const prev = useStore((state) => state.prev);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prev();
          break;
        case "ArrowRight":
          event.preventDefault();
          next();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, prev]);

  return (
    <div className="min-h-screen w-full grid-cols-[auto_1fr_auto] content-center sm:grid">
      <div className="hidden self-center p-2 sm:block">
        <Button
          onClick={prev}
          size="icon"
          variant="secondary"
          className="rounded-full"
        >
          <ArrowLeftIcon />
        </Button>
      </div>
      <WordTags />
      <div className="flex items-center justify-center gap-2">
        <div className="sm:hidden sm:p-2">
          <Button
            onClick={prev}
            size="icon"
            variant="secondary"
            className="rounded-full"
          >
            <ArrowLeftIcon />
          </Button>
        </div>
        <div className="sm:self-center sm:p-2">
          <Button
            onClick={next}
            size="icon"
            variant="secondary"
            className="rounded-full"
          >
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
