import { BG_COLORS, COLORS } from "@/lib/constants";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { CommandItem } from "@/components/ui/command";
import type { ITag } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useStore } from "@/stores/use-store";

export function EditTag({ id, tag }: { id: string; tag: ITag }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    tag: tag.tag,
    colorId: tag.colorId,
  });
  const updateTag = useStore((state) => state.updateTag);
  const removeTag = useStore((state) => state.removeTag);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = () => {
    flushSync(() => {
      setOpen(false);
    });
    setTimeout(() => {
      updateTag(id, data);
    }, 300);
  };

  const handleDelete = () => {
    flushSync(() => {
      setOpen(false);
    });
    setTimeout(() => {
      removeTag(id);
    }, 300);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <CommandItem asChild className="w-full">
          <DialogTrigger>
            <div
              className={cn("size-3 rounded-full", BG_COLORS[tag.colorId])}
            />{" "}
            {tag.tag}
          </DialogTrigger>
        </CommandItem>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit tag</DialogTitle>
            <DialogDescription>
              Rename and change your tag color here.
            </DialogDescription>
          </DialogHeader>
          <EditTagForm
            isDesktop={isDesktop}
            value={data}
            onChange={setData}
            handleChange={handleChange}
            handleDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <CommandItem asChild className="w-full">
        <DrawerTrigger>
          <div className={cn("size-3 rounded-full", BG_COLORS[tag.colorId])} />{" "}
          {tag.tag}
        </DrawerTrigger>
      </CommandItem>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Tag</DrawerTitle>
          <DrawerDescription>
            Rename and change your tag color here.
          </DrawerDescription>
        </DrawerHeader>
        <EditTagForm
          isDesktop={isDesktop}
          value={data}
          onChange={setData}
          handleChange={handleChange}
          handleDelete={handleDelete}
          className="px-4"
        />
        <DrawerFooter className="pt-2">
          <Button
            onClick={handleDelete}
            variant="outline"
            className="text-destructive"
          >
            Delete instead
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function EditTagForm({
  isDesktop,
  value,
  onChange,
  handleChange,
  handleDelete,
  className,
}: {
  isDesktop: boolean;
  value: ITag;
  onChange: (value: ITag) => void;
  handleChange: () => void;
  handleDelete: () => void;
  className?: string;
}) {
  return (
    <div className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="tag">Tag</Label>
        <Input
          type="text"
          id="tag"
          placeholder="Your tag"
          value={value.tag}
          onChange={(e) => onChange({ ...value, tag: e.target.value })}
        />
        <Label htmlFor="colorId">Color</Label>
        <Select
          value={value.colorId.toString()}
          onValueChange={(v) => onChange({ ...value, colorId: Number(v) })}
        >
          <SelectTrigger id="colorId" name="colorId" className={cn("w-full")}>
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            {COLORS.map((_, i) => {
              return (
                <SelectItem key={i} value={i.toString()}>
                  <div
                    className={cn(
                      "size-3 rounded-full",
                      BG_COLORS[i],
                      COLORS[i],
                    )}
                  />
                  Color {i + 1}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div
        className={
          isDesktop ? "flex items-center justify-end gap-2" : "grid gap-3"
        }
      >
        <Button
          onClick={handleDelete}
          variant="ghost"
          className={
            isDesktop ? "text-destructive hover:text-destructive" : "hidden"
          }
        >
          Delete instead
        </Button>
        <Button onClick={handleChange}>Save changes</Button>
      </div>
    </div>
  );
}
