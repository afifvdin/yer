import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "./ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ResponsiveDrawer({
  placeholder = "Filter...",
  emptyMessage = "No results found.",
  invoker,
  additionalItems,
  children,
}: {
  placeholder?: string;
  emptyMessage?: string;
  invoker: React.ReactNode;
  additionalItems?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{invoker}</PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          {additionalItems}
          <List placeholder={placeholder} emptyMessage={emptyMessage}>
            {children}
          </List>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="link">
          Tagset
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* {additionalItems} */}
        <div className="mt-4 border-t">
          <List placeholder={placeholder} emptyMessage={emptyMessage}>
            {children}
          </List>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function List({
  placeholder,
  emptyMessage,
  children,
}: {
  placeholder: string;
  emptyMessage: string;
  children: React.ReactNode;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>{children}</CommandGroup>
      </CommandList>
    </Command>
  );
}
