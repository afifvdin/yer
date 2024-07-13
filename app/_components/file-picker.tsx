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
import { TCorpus } from "@/lib/types"
import { cn } from "@/lib/utils"
import { usePosTaggingStore } from "@/store/use-pos-tagging-store"
import { File } from "lucide-react"
import { DragEvent, useRef, useState } from "react"

export default function FilePicker() {
  const setCorpus = usePosTaggingStore((state) => state.setCorpus)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [isHover, setIsHover] = useState(false)

  const doPickFile = () => {
    if (!fileRef.current) return
    fileRef.current.click()
  }

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.files) return
    const item = event.currentTarget.files[0]
    const data = (await new Response(item).json()) as string[][]
    const output: TCorpus = data.map((words) =>
      words.map((word) => ({ word: word, tagId: -1 }))
    )
    setCorpus(output)
  }

  const handleOnDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsHover(false)
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
    const data = (await new Response(file).json()) as string[][]
    const output: TCorpus = data.map((words) =>
      words.map((word) => ({ word: word, tagId: -1 }))
    )
    setCorpus(output)
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
      <h1 className="font-bold text-5xl tracking-tighter text-primary">
        Yet Another Labeler
      </h1>
      <div
        className={cn(
          "group max-w-xl w-full flex flex-col items-center justify-center py-8 px-4 border dark:border-neutral-800 rounded-2xl gap-4 bg-neutral-50 dark:bg-neutral-900 ring ring-offset-2 dark:ring-offset-0 ring-transparent transition-all",
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
          <p className="font-bold tracking-tight">
            Drag and drop file to upload
          </p>
          <p className="text-neutral-500 text-sm font-medium tracking-tight">
            We only accept file with certain{" "}
            <Dialog>
              <DialogTrigger>
                <span className="underline">structures</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Accepted file structures</DialogTitle>
                  <DialogDescription>
                    data.json
                    <code className="block whitespace-pre-wrap">
                      {`
[
  ['word1','word2','word3','word4','word5','word6', ...],
  ['word1','word2','word3','word4','word5','word6', ...],
  ['word1','word2','word3','word4','word5','word6', ...],
  ...
]
                      `}
                    </code>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>
        </div>
        <input
          id="file"
          type="file"
          accept=".json"
          className="hidden"
          ref={fileRef}
          onChange={onInputChange}
        />
        <Button size="sm" onClick={doPickFile}>
          Select file
        </Button>
      </div>
    </div>
  )
}
