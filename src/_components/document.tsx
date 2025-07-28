import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export default function Document() {
  return (
    <div
      className="grid h-full w-full"
      style={{ gridTemplateColumns: "auto 1fr auto" }}
    >
      <div className="flex flex-col items-center justify-center pl-2 sm:p-8">
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-auto w-auto rounded-full p-2"
              >
                <ChevronLeft className="size-4 sm:size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex w-full flex-col items-center justify-center overflow-y-auto">
        <ScrollArea className="relative mx-2 max-h-[calc(100vh-13rem)] overflow-y-auto">
          <div className="from-background pointer-events-none absolute top-0 left-0 h-8 w-full bg-gradient-to-b to-transparent"></div>
          <div className="from-background pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-gradient-to-t to-transparent"></div>
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-3 py-4 whitespace-nowrap">
            <WordTagButton key="i" index={0} word={"Kata"} tagId={1} />
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          Document 1 of 1
        </p>
      </div>
      <div className="flex flex-col items-center justify-center pr-2 sm:p-8">
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="h-auto w-auto rounded-full p-2"
              >
                <ChevronRight className="size-4 sm:size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

const WordTagButton = ({
  index,
  word,
  tagId,
}: {
  index: number;
  word: string;
  tagId: number;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex h-auto w-auto items-baseline gap-1 px-2 py-1 sm:px-3 sm:py-1.5"
        >
          <span className="text-sm sm:text-base">{word}</span>
          <span className={cn("text-xs font-bold")}>NN</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuRadioGroup className="max-h-48 overflow-y-auto">
          <DropdownMenuRadioItem value="NN">NN</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 hover:!text-red-500">
          Remove Tag
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
