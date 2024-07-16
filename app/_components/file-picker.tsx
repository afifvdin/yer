"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { ITag, ITagset, TCorpus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { usePosTaggerStore } from "@/store/use-pos-tagger-store"
import { File } from "lucide-react"
import { DragEvent, useRef, useState } from "react"
import { useMediaQuery } from "react-responsive"
import { toast } from "sonner"

export default function FilePicker() {
  const setCorpus = usePosTaggerStore((state) => state.setCorpus)
  const setTagset = usePosTaggerStore((state) => state.setTagset)
  const addTags = usePosTaggerStore((state) => state.addTags)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [isHover, setIsHover] = useState(false)
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  const handlePickFile = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const handleUseSample = () => {
    setCorpus([
      [
        { word: "The", tagId: 1 },
        { word: "quick", tagId: 2 },
        { word: "brown", tagId: 2 },
        { word: "fox", tagId: 3 },
        { word: "jumps", tagId: 4 },
        { word: "over", tagId: 5 },
        { word: "the", tagId: 1 },
        { word: "lazy", tagId: 2 },
        { word: "dog", tagId: 3 },
      ],
    ])
    addTags(["DT", "JJ", "NN", "VBZ", "IN"])
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.currentTarget.files) return
    try {
      const item = event.currentTarget.files[0]
      const parsedFile = await new Response(item).json()
      const isContinue = parsedFile["app"] === "yer"
      if (isContinue) {
        const data = parsedFile as {
          app: string
          corpus: TCorpus
          tagset: ITagset
        }
        setCorpus(data.corpus)
        setTagset(data.tagset)
      } else {
        const data = parsedFile as string[][]
        const output: TCorpus = data.map((words) =>
          words.map((word) => ({ word: word, tagId: 0 }))
        )
        setCorpus(output)
      }
    } catch (e) {
      toast.error("Cannot parse file. Please try again.")
    }
  }

  const handleOnDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsHover(false)
    try {
      const items = Array.from(event.dataTransfer.items)
      let file
      if (!items) return
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === "file") {
          file = item.getAsFile()
          break
        }
      }
      const parsedFile = await new Response(file).json()
      const isContinue = parsedFile["app"] === "yer"
      if (isContinue) {
        const data = parsedFile as {
          app: string
          corpus: TCorpus
          tagset: ITagset
        }
        setCorpus(data.corpus)
        setTagset(data.tagset)
      } else {
        const data = parsedFile as string[][]
        const output: TCorpus = data.map((words) =>
          words.map((word) => ({ word: word, tagId: 0 }))
        )
        setCorpus(output)
      }
    } catch (e) {
      toast.error("Cannot parse file. Please try again.")
    }
  }

  const handleOnDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsHover(true)
  }

  const handleOnDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const { relatedTarget } = event
    if (
      !relatedTarget ||
      !event.currentTarget.contains(relatedTarget as Node)
    ) {
      setIsHover(false)
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-center font-bold text-xl sm:text-5xl tracking-tighter text-primary">
        Tagger for Developer
      </h1>
      <div
        className={cn(
          "group mx-4 max-w-xl sm:w-full flex flex-col items-center justify-center p-6 sm:py-8 sm:px-4 border dark:border-neutral-800 rounded-2xl gap-2 sm:gap-4 bg-neutral-50 dark:bg-neutral-900 ring ring-offset-2 dark:ring-offset-0 ring-transparent transition-all",
          isHover && "ring-neutral-700"
        )}
        onDrop={handleOnDrop}
        onDragEnter={handleOnDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleOnDragLeave}
      >
        <div className="p-2 rounded-xl border dark:border-neutral-700 shadow">
          <div className="w-fit h-fit p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200">
            <File />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm sm:text-base font-bold tracking-tight">
            Drag and drop file
          </p>
          <p className="text-neutral-500 text-xs sm:text-sm font-medium tracking-tight">
            Saved yer.json file or json file with certain{" "}
            {isDesktop ? (
              <Dialog>
                <DialogTrigger>
                  <span className="underline">structures</span>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Accepted file structures</DialogTitle>
                    <DialogDescription>data.json</DialogDescription>
                  </DialogHeader>
                  <code className="block whitespace-pre-wrap">
                    {`
[
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ...
]
                      `}
                  </code>
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer>
                <DrawerTrigger>
                  <span className="underline">structures</span>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Accepted file structures</DrawerTitle>
                    <DrawerDescription>data.json</DrawerDescription>
                  </DrawerHeader>
                  <code className="block whitespace-pre-wrap px-4 text-xs">
                    {`
[
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ['word1','word2','word3', ...],
  ...
]
        `}
                  </code>
                  <DrawerFooter />
                </DrawerContent>
              </Drawer>
            )}
          </p>
        </div>
        <input
          id="file"
          type="file"
          accept=".json"
          className="hidden"
          ref={fileRef}
          onChange={handleFileChange}
        />
        <div className="flex items-center justify-center gap-4">
          <Button
            className="w-auto h-auto p-2 font-medium text-xs sm:text-sm"
            onClick={handlePickFile}
          >
            Select file
          </Button>
          <Button
            variant="outline"
            className="bg-accent hover:bg-accent/80 w-auto h-auto p-2 font-medium text-xs sm:text-sm"
            onClick={handleUseSample}
          >
            Use Sample
          </Button>
        </div>
      </div>
    </div>
  )
}
