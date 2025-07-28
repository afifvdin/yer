import { MenuIndicator } from "./menu-indicator";
import { MenuSearch } from "./menu-search";
import React from "react";
import { useStore } from "@/stores/use-store";

export function Menu() {
  const [open, setOpen] = React.useState(false);
  const jump = useStore((state) => state.jump);
  const documentsLength = useStore((state) => state.getSentencesLength());
  const items = React.useMemo(
    () => Array(documentsLength).fill(null),
    [documentsLength],
  );
  const shortcut = window.navigator.userAgent.includes("Mac") ? "⌘" : "Ctrl";

  const handleJump = (index: string) => {
    jump(Number(index) - 1);
    setOpen(false);
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="flex w-min items-center gap-2 whitespace-nowrap">
        <MenuIndicator setOpen={setOpen} />
        <div className="hidden gap-1 sm:flex">
          <p className="bg-secondary rounded border px-1 text-xs">{shortcut}</p>
          <p className="bg-secondary rounded border px-1 text-xs">K</p>
        </div>
      </div>
      <MenuSearch
        open={open}
        setOpen={setOpen}
        handleJump={handleJump}
        items={items}
      />
    </>
  );
}
