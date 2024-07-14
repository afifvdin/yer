"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TDocument } from "@/lib/types"
import { cn, COLORS } from "@/lib/utils"
import { usePosTaggerStore } from "@/store/use-pos-tagger-store"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

export default function Document() {
  const corpus = usePosTaggerStore((state) => state.corpus)
  const next = usePosTaggerStore((state) => state.next)
  const prev = usePosTaggerStore((state) => state.prev)
  const countCorpus = useMemo(() => corpus.length, [corpus])
  const activeDocumentIndex = usePosTaggerStore(
    (state) => state.activeDocumentIndex
  )
  const doc: TDocument = corpus[activeDocumentIndex]

  return (
    <div
      className="grid w-full h-full"
      style={{ gridTemplateColumns: "auto 1fr auto" }}
    >
      <div className="pl-2 sm:p-8 flex flex-col items-center justify-center">
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Button
                disabled={countCorpus === 0 || activeDocumentIndex === 0}
                onClick={() => prev()}
                variant="outline"
                className="w-auto h-auto p-2 rounded-full"
              >
                <ChevronLeft className="size-4 sm:size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="w-full overflow-y-auto flex flex-col items-center justify-center">
        <ScrollArea className="relative max-h-[calc(100vh-13rem)] mx-2 overflow-y-auto">
          <div className="pointer-events-none absolute left-0 top-0 w-full h-8 bg-gradient-to-b from-background to-transparent"></div>
          <div className="pointer-events-none absolute left-0 bottom-0 w-full h-8 bg-gradient-to-t from-background to-transparent"></div>
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap whitespace-nowrap py-4 px-3">
            {doc.map((token, i) => {
              return (
                <WordTagButton
                  key={token + i.toString()}
                  index={i}
                  word={token.word}
                  tagId={token.tagId}
                />
              )
            })}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        <p className="mt-2 text-xs text-neutral-500 font-medium">
          Document {activeDocumentIndex + 1} of {corpus.length}
        </p>
      </div>
      <div className="pr-2 sm:p-8 flex flex-col items-center justify-center">
        <TooltipProvider>
          <Tooltip delayDuration={150}>
            <TooltipTrigger asChild>
              <Button
                disabled={
                  countCorpus === 0 || activeDocumentIndex === countCorpus - 1
                }
                onClick={() => next()}
                variant="outline"
                className="w-auto h-auto p-2 rounded-full"
              >
                <ChevronRight className="size-4 sm:size-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

const WordTagButton = ({
  index,
  word,
  tagId,
}: {
  index: number
  word: string
  tagId: number
}) => {
  const tagset = usePosTaggerStore((state) => state.tagset)
  const setTag = usePosTaggerStore((state) => state.setTag)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-baseline gap-1 py-1 sm:py-1.5 px-2 sm:px-3 h-auto w-auto"
        >
          <span className="text-sm sm:text-base">{word}</span>
          {tagset[tagId] && (
            <span
              className={cn("font-bold text-xs", COLORS[tagset[tagId].colorId])}
            >
              {tagset[tagId].name}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        {Object.keys(tagset).length > 0 ? (
          <>
            <DropdownMenuRadioGroup
              value={tagset[tagId] ? tagset[tagId].name : ""}
              className="max-h-48 overflow-y-auto"
            >
              {Object.keys(tagset).map((key, _) => {
                return (
                  <DropdownMenuRadioItem
                    key={key}
                    value={tagset[parseInt(key)].name}
                    onSelect={() => setTag(index, parseInt(key))}
                  >
                    {tagset[parseInt(key)].name}
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setTag(index, 0)}
              className="text-red-500 hover:!text-red-500"
            >
              Remove Tag
            </DropdownMenuItem>
          </>
        ) : (
          <p className="text-center p-2 text-xs">No Tags Available</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
