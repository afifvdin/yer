import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

import { EditTag } from "./edit-tag";
import { NewTags } from "./new-tags";
import React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/stores/use-store";

export function Tagset() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="cursor-pointer underline">
          Tagset
        </PopoverTrigger>
        <PopoverContent className="max-w-48 p-0" align="center">
          <List />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="cursor-pointer underline">Tagset</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Tagset</DrawerTitle>
          <DrawerDescription>
            Search for your tags, click to edit or create new one
          </DrawerDescription>
        </DrawerHeader>
        <div className="mt-4 border-t">
          <List />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function List() {
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
            return <EditTag key={id} id={id} tag={tagset[id]} />;
          })}
          <CommandSeparator
            className={cn("my-1", Object.keys(tagset).length === 0 && "hidden")}
          />
          <NewTags />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
