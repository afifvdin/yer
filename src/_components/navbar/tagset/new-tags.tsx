import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/stores/use-store";

export function NewTags() {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState("");
  const addTags = useStore((state) => state.addTags);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = () => {
    addTags(tags.split(","));
    setTags("");
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <CommandItem asChild className="w-full" value="do-not-filter">
          <DialogTrigger>
            <PlusIcon /> New Tags
          </DialogTrigger>
        </CommandItem>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Tags</DialogTitle>
            <DialogDescription>
              Create new tags here. separates them with comma
            </DialogDescription>
          </DialogHeader>
          <NewTagsForm
            value={tags}
            onChange={setTags}
            handleChange={handleChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <CommandItem asChild className="w-full" value="do-not-filter">
        <DrawerTrigger>
          <PlusIcon /> New Tags
        </DrawerTrigger>
      </CommandItem>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Tags</DrawerTitle>
          <DrawerDescription>
            Create new tags, separates them with comma
          </DrawerDescription>
        </DrawerHeader>
        <NewTagsForm
          value={tags}
          onChange={setTags}
          handleChange={handleChange}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function NewTagsForm({
  value,
  onChange,
  handleChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  handleChange: () => void;
  className?: string;
}) {
  return (
    <div className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="tags">Tags</Label>
        <Input
          type="text"
          id="tags"
          placeholder="NN,NNP,..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button onClick={handleChange}>Save changes</Button>
    </div>
  );
}
