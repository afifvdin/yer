"use client"

import { GeistMono } from "geist/font/mono"
import { useMediaQuery } from "react-responsive"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn, COLORS } from "@/lib/utils"
import { memo, useEffect, useMemo, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ChevronUp, Circle, Download, File } from "lucide-react"
import { usePosTaggerStore } from "@/store/use-pos-tagger-store"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { IDialog, IDialogTagId } from "@/lib/types"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Scrollbar } from "@radix-ui/react-scroll-area"
import { toast } from "sonner"

export default function BottomMenu() {
  const corpus = usePosTaggerStore((state) => state.corpus)
  const tagset = usePosTaggerStore((state) => state.tagset)
  const documentList = useMemo(() => [...Array(corpus.length)], [corpus])
  const [selectedTag, setSelectedTag] = useState({
    id: 0,
    name: "",
    colorId: -1,
  })
  const [openDialog, setOpenDialog] = useState({
    newTags: false,
    editTag: false,
    resetTagset: false,
    removeTag: false,
  })

  const handleOpenCommand = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { ctrlKey: true, key: "k" })
    )
  }

  const handleExport = () => {
    const transformCorpus = corpus.map((document) => {
      return document.map((wordtag) => {
        if (!(wordtag.tagId in tagset)) return [wordtag.word, ""]
        return [wordtag.word, tagset[wordtag.tagId].name]
      })
    })
    const data = JSON.stringify(transformCorpus)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "annotated.json"
    link.click()
    URL.revokeObjectURL(url)
    toast("File downloaded as annotated.json")
  }

  const handleSave = () => {
    const toSave = {
      app: "yer",
      corpus: [...corpus],
      tagset: { ...tagset },
    }
    const data = JSON.stringify(toSave)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "yer.json"
    link.click()
    URL.revokeObjectURL(url)
    toast("File saved as yer.json")
  }

  return (
    <div className="fixed bottom-0 left-0 sm:p-8 w-full sm:flex sm:items-center sm:justify-center">
      <NewTagsDialog
        open={openDialog.newTags}
        setOpen={(open: boolean) =>
          setOpenDialog({ ...openDialog, newTags: open })
        }
      />
      <EditTagDialog
        open={openDialog.editTag}
        setOpen={(open: boolean) =>
          setOpenDialog({ ...openDialog, editTag: open })
        }
        tag={selectedTag}
      />
      <ResetTagsetDialog
        open={openDialog.resetTagset}
        setOpen={(open: boolean) =>
          setOpenDialog({ ...openDialog, resetTagset: open })
        }
      />
      <RemoveTagDialog
        open={openDialog.removeTag}
        setOpen={(open: boolean) =>
          setOpenDialog({ ...openDialog, removeTag: open })
        }
        tag={selectedTag}
      />
      <ScrollArea>
        <div className="bg-background p-4 sm:p-2 sm:rounded-lg border-t sm:border sm:shadow-xl flex items-center sm:justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto w-auto text-sm py-1 sm:py-1.5 px-2 sm:px-3"
              >
                Tagset ({Object.keys(tagset).length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
              <DropdownMenuGroup className="max-h-48 overflow-y-auto">
                {Object.keys(tagset).map((key, index) => {
                  return (
                    <DropdownMenuSub key={key}>
                      <DropdownMenuSubTrigger>
                        {tagset[parseInt(key)].name}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedTag({
                              id: parseInt(key),
                              ...tagset[parseInt(key)],
                            })
                            setOpenDialog({ ...openDialog, editTag: true })
                          }}
                        >
                          Edit..
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setSelectedTag({
                              id: parseInt(key),
                              ...tagset[parseInt(key)],
                            })
                            setOpenDialog({ ...openDialog, removeTag: true })
                          }}
                          className="text-red-500 hover:!text-red-500"
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  )
                })}
              </DropdownMenuGroup>
              {Object.keys(tagset).length > 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={() => setOpenDialog({ ...openDialog, newTags: true })}
              >
                Add..
              </DropdownMenuItem>
              {Object.keys(tagset).length > 0 && (
                <DropdownMenuItem
                  onSelect={() =>
                    setOpenDialog({ ...openDialog, resetTagset: true })
                  }
                  className="text-red-500 hover:!text-red-500"
                >
                  Reset
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <Button
            onClick={handleOpenCommand}
            variant="outline"
            className="h-auto w-auto text-sm py-1 sm:py-1.5 px-2 sm:px-3"
          >
            Jump to..{" "}
            <kbd
              className={cn(
                GeistMono.className,
                "ml-2 border text-xs py-0.5 px-1 bg-background rounded leading-none"
              )}
            >
              ⌘ K
            </kbd>
          </Button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="font-semibold h-auto w-auto text-sm py-1 sm:py-1.5 px-2 sm:px-3">
                <span>Corpus</span>
                <ChevronUp className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
              <DropdownMenuItem onSelect={handleExport}>
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleSave}>
                Save to tag later
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Scrollbar orientation="horizontal" />
      </ScrollArea>
      <CommandComponent list={documentList} />
    </div>
  )
}

const NewTagsDialog = ({ open, setOpen }: IDialog) => {
  const [tags, setTags] = useState("")
  const addTags = usePosTaggerStore((state) => state.addTags)
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTags(e.target.value)
  }

  const handleAddNewTags = () => {
    if (tags !== "") {
      let newTags = tags.split(",")
      addTags(newTags)
    }
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new tags</DialogTitle>
            <DialogDescription>
              Type your tags you want to add, separated by comma (no space).
            </DialogDescription>
          </DialogHeader>
          <Textarea placeholder="NN, NNP, ..." onChange={handleChange} />
          <DialogFooter>
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddNewTags} size="sm">
              Add tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent aria-describedby="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Add new tags</DrawerTitle>
          <DrawerDescription>
            Type your tags you want to add, separated by comma (no space).
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <Textarea placeholder="NN, NNP, ..." onChange={handleChange} />
        </div>
        <DrawerFooter>
          <Button onClick={handleAddNewTags} size="sm">
            Add tags
          </Button>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const EditTagDialog = ({ open, setOpen, tag }: IDialogTagId) => {
  const updateTag = usePosTaggerStore((state) => state.updateTag)
  const [updatedTag, setUpdatedTag] = useState({
    name: "",
    colorId: -1,
  })
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTag({
      ...updatedTag,
      name: e.target.value,
    })
  }

  const handleUpdateTag = () => {
    updateTag(tag.id, {
      name: updatedTag.name === "" ? tag.name : updatedTag.name,
      colorId: updatedTag.colorId === -1 ? tag.colorId : updatedTag.colorId,
    })
    setOpen(false)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {tag.name} tag</DialogTitle>
            <DialogDescription>
              Edit {tag.name} tag just like you want.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input
              placeholder={tag.name}
              value={updatedTag.name}
              onChange={handleChangeName}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Circle
                    className={cn(
                      "size-4",
                      COLORS[
                        updatedTag.colorId === -1
                          ? tag.colorId
                          : updatedTag.colorId
                      ]
                    )}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top">
                <DropdownMenuRadioGroup
                  value={
                    updatedTag.colorId === -1
                      ? tag.colorId.toString()
                      : updatedTag.colorId.toString()
                  }
                  className="max-h-48 overflow-y-auto"
                >
                  {COLORS.map((color, i) => {
                    return (
                      <DropdownMenuRadioItem
                        key={color}
                        className={color}
                        value={i.toString()}
                        onSelect={(e) =>
                          setUpdatedTag({
                            ...updatedTag,
                            colorId: i,
                          })
                        }
                      >
                        Color {i + 1}
                      </DropdownMenuRadioItem>
                    )
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdateTag} size="sm">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent aria-describedby="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit {tag.name} tag</DrawerTitle>
          <DrawerDescription>
            Edit {tag.name} tag just like you want.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center gap-2 p-4 sm:p-0">
          <Input
            placeholder={tag.name}
            value={updatedTag.name === "" ? tag.name : updatedTag.name}
            onChange={handleChangeName}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Circle
                  className={cn(
                    "size-4",
                    COLORS[
                      updatedTag.colorId === -1
                        ? tag.colorId
                        : updatedTag.colorId
                    ]
                  )}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top">
              <DropdownMenuRadioGroup
                value={
                  updatedTag.colorId === -1
                    ? tag.colorId.toString()
                    : updatedTag.colorId.toString()
                }
                className="max-h-48 overflow-y-auto"
              >
                {COLORS.map((color, i) => {
                  return (
                    <DropdownMenuRadioItem
                      key={color}
                      className={color}
                      value={i.toString()}
                      onSelect={(e) =>
                        setUpdatedTag({
                          ...updatedTag,
                          colorId: i,
                        })
                      }
                    >
                      Color {i + 1}
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DrawerFooter>
          <Button onClick={handleUpdateTag} size="sm">
            Update
          </Button>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const ResetTagsetDialog = ({ open, setOpen }: IDialog) => {
  const resetTagset = usePosTaggerStore((state) => state.resetTagset)
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  const onResetTagset = () => {
    setOpen(false)
    resetTagset()
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure want to reset tagset?</DialogTitle>
            <DialogDescription>This action cannot be undone!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={onResetTagset} size="sm" variant="destructive">
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent aria-describedby="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you sure want to reset tagset?</DrawerTitle>
          <DrawerDescription>This action cannot be undone!</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={onResetTagset} size="sm" variant="destructive">
            Reset
          </Button>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const RemoveTagDialog = ({ open, setOpen, tag }: IDialogTagId) => {
  const removeTag = usePosTaggerStore((state) => state.removeTag)
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  const handleRemoveTag = () => {
    setOpen(false)
    removeTag(tag.id)
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure want to remove {tag.name} tag?
            </DialogTitle>
            <DialogDescription>This action cannot be undone!</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={handleRemoveTag} size="sm" variant="destructive">
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent aria-describedby="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Are you sure want to remove {tag.name} tag?</DrawerTitle>
          <DrawerDescription>This action cannot be undone!</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button onClick={handleRemoveTag} size="sm" variant="destructive">
            Remove
          </Button>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const CommandComponent = memo(function _({ list }: { list: string[] }) {
  const jump = usePosTaggerStore((state) => state.jump)
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery({
    query: "(min-width: 640px)",
  })

  useEffect(() => {
    function detect(event: KeyboardEvent) {
      if (event.ctrlKey && (event.key === "k" || event.key === "K")) {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener("keydown", detect)
    return () => document.removeEventListener("keydown", detect)
  }, [])

  if (isDesktop) {
    return (
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to specific document..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Documents">
            {list.map((v, i) => {
              return (
                <CommandItem
                  key={i}
                  onSelect={() => {
                    setOpen(false)
                    jump(i)
                  }}
                >
                  <File className="mr-2 h-4 w-4" />
                  <span>Document {i + 1}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerContent aria-describedby="">
        <DrawerHeader className="text-left">
          <DrawerTitle>Jump to specific document</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="w-screen">
          <div className="flex w-max gap-2 px-4 py-2">
            {list.map((v, i) => {
              return (
                <Button
                  key={i}
                  variant="outline"
                  className="w-auto h-auto size-12"
                  onClick={() => {
                    setOpen(false)
                    jump(i)
                  }}
                >
                  {i + 1}
                </Button>
              )
            })}
          </div>
          <Scrollbar orientation="horizontal" />
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
})
