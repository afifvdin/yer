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
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { ISentence, ITagset } from "@/lib/types";

import { FileJsonIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useStore } from "@/stores/use-store";

const exampleYer = `{
  yer: {
    tagset: {
      <string>: {
        tag: <string>,
        colorId: <number>
      }
      ...
    }
  },
  words: [
    [
      [word, tagId], ...
    ],
    ...
  ]
}
`;

const exampleSentence = `[
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ...
]`;

export function Uploader() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const setTagset = useStore((state) => state.setTagset);
  const setSentences = useStore((state) => state.setSentences);

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof Element &&
      (e.target.closest("[data-ignore-input]") ||
        e.target.closest("[data-vaul-overlay]"))
    ) {
      return;
    }
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    try {
      const item = event.target.files[0];
      const parsedFile = await new Response(item).json();
      const isContinue = parsedFile["yer"];
      if (isContinue) {
        const data = parsedFile as {
          yer: {
            tagset: ITagset;
          };
          words: [string, string][][];
        };
        setTagset(data.yer.tagset);
        setSentences(
          data.words.map((words) => {
            return {
              sentence: words.join(" "),
              words: words.map(([word, tagId]) => ({ word, tagId })),
            };
          }),
        );
      } else {
        const data = parsedFile as string[][];
        const newSentences: ISentence[] = data.map((sentence) => {
          return {
            sentence: sentence.join(" "),
            words: sentence.map((word) => ({ word, tagId: "" })),
          };
        });
        setSentences(newSentences);
      }
    } catch (e) {
      console.log({ e });
      toast.error("Cannot parse file. Please try again.");
    }
  };

  return (
    <main vaul-drawer-wrapper="" className="bg-background h-screen w-full">
      <div
        onClick={onClick}
        className="flex min-h-screen w-full items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground flex items-center">
            <FileJsonIcon className="-mr-12 size-20 -rotate-6 stroke-1" />
            <FileJsonIcon className="fill-background z-1 size-24 stroke-1" />
            <FileJsonIcon className="-ml-12 size-20 rotate-6 stroke-1" />
          </div>
          <p className="text-muted-foreground text-base">
            Drag and drop or click anywhere to select your file
          </p>
          <div data-ignore-input>
            <Dialog>
              <DialogTrigger className="hidden sm:block">
                <p className="text-muted-foreground cursor-pointer text-xs underline">
                  How to structures my file?
                </p>
              </DialogTrigger>
              <DialogContent
                className="text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle>Accepted file structures</DialogTitle>
                  <DialogDescription>with yer.json</DialogDescription>
                </DialogHeader>
                <code className="block font-mono whitespace-pre-wrap">
                  {exampleYer}
                </code>
                <p className="text-muted-foreground">or with sentence.json</p>
                <code className="block font-mono whitespace-pre-wrap">
                  {exampleSentence}
                </code>
              </DialogContent>
            </Dialog>
            <Drawer>
              <DrawerTrigger className="block sm:hidden">
                <p className="text-muted-foreground cursor-pointer text-xs underline">
                  How to structures my file?
                </p>
              </DrawerTrigger>
              <DrawerContent
                className="text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <DrawerHeader className="text-left">
                  <DrawerTitle>Accepted file structures</DrawerTitle>
                  <DrawerDescription>with yer.json</DrawerDescription>
                </DrawerHeader>
                <code className="block font-mono whitespace-pre-wrap">
                  {exampleYer}
                </code>
                <p className="text-muted-foreground">or with sentence.json</p>
                <code className="block font-mono whitespace-pre-wrap">
                  {exampleSentence}
                </code>
                <DrawerFooter />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        onChange={handleChange}
        type="file"
        name="file"
        id="file"
        className="hidden"
      />
    </main>
  );
}
