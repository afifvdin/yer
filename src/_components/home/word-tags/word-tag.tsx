import { BG_COLORS, COLORS } from "@/lib/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import type { IWord } from "@/lib/types";
import React from "react";
import { TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/stores/use-store";

export const WordTag = React.memo(
  ({ index, word }: { index: number; word: IWord }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const setWordTag = useStore((state) => state.setWordTag);
    const removeWordTag = useStore((state) => state.removeWordTag);
    const tagset = useStore((state) => state.tagset);

    const onSelectTag = (value: string) => {
      setWordTag(index, value.split("/")[0]);
      setOpen(false);
    };

    const onRemoveTag = () => {
      removeWordTag(index);
      setOpen(false);
    };

    if (isDesktop) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className="flex flex-col items-center justify-center gap-3 rounded-none font-normal"
            >
              <p className="text-base leading-1">{word.word}</p>
              <p
                className={cn(
                  "text-xs leading-0",
                  tagset[word.tagId]?.colorId &&
                    COLORS[tagset[word.tagId].colorId],
                )}
              >
                {tagset[word.tagId]?.tag}
              </p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-48 p-0" align="center">
            <Tags onSelectTag={onSelectTag} onRemoveTag={onRemoveTag} />
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="flex flex-col items-center justify-center gap-3 rounded-none font-normal"
          >
            <p className="text-base leading-1">{word.word}</p>
            <p
              className={cn(
                "text-xs leading-0",
                tagset[word.tagId]?.colorId &&
                  COLORS[tagset[word.tagId].colorId],
              )}
            >
              {tagset[word.tagId]?.tag}
            </p>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{word.word}</DrawerTitle>
            <DrawerDescription>Select tag</DrawerDescription>
          </DrawerHeader>
          <div className="mt-4 border-t">
            <Tags onSelectTag={onSelectTag} onRemoveTag={onRemoveTag} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
);

function Tags({
  onSelectTag,
  onRemoveTag,
}: {
  onSelectTag: (value: string) => void;
  onRemoveTag: () => void;
}) {
  const tagset = useStore((state) => state.tagset);
  return (
    <Command
      filter={(value, search) => {
        if (value.includes("do-not-filter")) {
          return 1;
        }
        return value.includes(search.toUpperCase()) ? 1 : 0;
      }}
    >
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Object.keys(tagset).map((id) => {
            return (
              <CommandItem
                key={id}
                className="w-full"
                value={`${id}/${tagset[id].tag}`}
                onSelect={onSelectTag}
              >
                <div
                  className={cn(
                    "size-3 rounded-full",
                    BG_COLORS[tagset[id].colorId],
                  )}
                />{" "}
                {tagset[id].tag}
              </CommandItem>
            );
          })}
          <CommandSeparator
            className={cn("my-1", Object.keys(tagset).length === 0 && "hidden")}
          />
          <CommandItem
            className="!text-destructive hover:text-destructive w-full"
            value="do-not-filter"
            onSelect={onRemoveTag}
          >
            <TrashIcon className="text-destructive" /> Remove Tag
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
