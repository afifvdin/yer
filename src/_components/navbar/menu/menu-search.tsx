import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import React from "react";
import { TextIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";

export function MenuSearch({
  items,
  open,
  setOpen,
  handleJump,
  height = "400px",
}: {
  items: string[];
  open: boolean;
  setOpen: (v: boolean) => void;
  handleJump: (v: string) => void;
  height?: string;
}) {
  const [filteredItems, setFilteredItems] = React.useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(true);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "auto",
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    const allItems = items.map((_, index) => (index + 1).toString());

    setFilteredItems(allItems.filter((item) => item.includes(search)));
    setFocusedIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filteredItems.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? filteredItems.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (filteredItems[focusedIndex]) {
          handleJump(filteredItems[focusedIndex]);
          setOpen(false);
        }
        break;
      }
      case "Escape": {
        setOpen(false);
        break;
      }
      default:
        break;
    }
  };

  React.useEffect(() => {
    const allItems = items.map((_, index) => (index + 1).toString());
    setFilteredItems(allItems);
    setFocusedIndex(0);
  }, [items]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command shouldFilter={false} onKeyDown={handleKeyDown}>
        <CommandInput
          placeholder="Search sentences..."
          onValueChange={handleSearch}
        />
        <CommandList
          ref={parentRef}
          className="w-full overflow-auto pb-2"
          style={{
            height: height,
          }}
          onMouseDown={() => setIsKeyboardNavActive(false)}
          onMouseMove={() => setIsKeyboardNavActive(false)}
        >
          <CommandEmpty>No sentences found.</CommandEmpty>
          <CommandGroup>
            <div
              className="relative w-full"
              style={{
                height: `${virtualizer.getTotalSize()}px`,
              }}
            >
              {virtualOptions.map((virtualOption) => (
                <CommandItem
                  key={filteredItems[virtualOption.index]}
                  className={cn(
                    "absolute top-0 left-0 w-full cursor-pointer bg-transparent",
                    focusedIndex === virtualOption.index &&
                      "bg-accent text-accent-foreground",
                    isKeyboardNavActive &&
                      focusedIndex !== virtualOption.index &&
                      "aria-selected:text-primary aria-selected:bg-transparent",
                  )}
                  style={{
                    height: `${virtualOption.size}px`,
                    transform: `translateY(${virtualOption.start}px)`,
                  }}
                  value={filteredItems[virtualOption.index]}
                  onMouseEnter={() =>
                    !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                  }
                  onMouseLeave={() =>
                    !isKeyboardNavActive && setFocusedIndex(-1)
                  }
                  onSelect={(value) => {
                    handleJump(value);
                    setOpen(false);
                  }}
                >
                  <TextIcon className="ml-2 size-3" />
                  <span>{filteredItems[virtualOption.index]}</span>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
