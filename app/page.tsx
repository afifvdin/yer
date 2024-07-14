"use client"

import BottomMenu from "./_components/bottom-menu"
import Navbar from "./_components/navbar"
import { usePosTaggerStore } from "@/store/use-pos-tagger-store"
import Document from "./_components/document"
import FilePicker from "./_components/file-picker"

export default function Home() {
  const corpusExist = usePosTaggerStore((state) => state.corpusExist)

  return (
    <main vaul-drawer-wrapper="" className="w-full h-screen bg-background">
      <Navbar />
      {!corpusExist ? (
        <FilePicker />
      ) : (
        <>
          <Document />
          <BottomMenu />
        </>
      )}
    </main>
  )
}
