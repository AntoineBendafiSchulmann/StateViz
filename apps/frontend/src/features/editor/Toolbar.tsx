import { Button } from '@radix-ui/themes'
import {
  PlusIcon,
  ArrowRightIcon,
  Trash2Icon,
  UploadIcon,
  DownloadIcon,
  Undo2Icon,
  Redo2Icon,
} from 'lucide-react'
import { useRef } from 'react'
import { useGraphStore } from './GraphStore'
import { downloadBlob } from '../../lib/file'
import { validateGraph } from '@stateviz/core'
import { errorAlert } from '../../lib/alert'

export function Toolbar() {
  const {
    graph,
    positions,
    setGraph,
    setPos,
    mode,
    setMode,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGraphStore()

  const fileRef = useRef<HTMLInputElement>(null)

  const addState = () => {
    const id = `state_${Object.keys(graph.states).length + 1}`
    setGraph({ ...graph, states: { ...graph.states, [id]: {} } })
    const idx = Object.keys(graph.states).length
    setPos(id, { x: 120 * idx, y: 120 * idx })
  }

  const toggleTransitionMode = () =>
    setMode(mode === 'idle' ? 'pick-target' : 'idle')

  const reset = () => {
    localStorage.removeItem('stateviz-store')
    window.location.reload()
  }

  const exportJson = () =>
    downloadBlob(
      JSON.stringify({ graph, positions }, null, 2),
      'stateviz.json',
    )

  const importJson = () => fileRef.current?.click()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    file.text().then((txt) => {
      try {
        const { graph: rawGraph, positions: p } = JSON.parse(txt)
        const res = validateGraph(rawGraph)
        if (!res.ok) {
          errorAlert(`Fichier invalide : ${res.error}`)
          return
        }
        setGraph(res.value)
        Object.entries(p ?? {}).forEach(([id, pos]) =>
          setPos(id, pos as { x: number; y: number }),
        )
      } catch {
        errorAlert('JSON mal formé')
      }
    })
    e.target.value = ''
  }

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-10 flex gap-2">
      <Button onClick={addState}>
        <PlusIcon size={16} /> State
      </Button>
      <Button
        onClick={toggleTransitionMode}
        variant={mode === 'pick-target' ? 'solid' : 'soft'}
      >
        <ArrowRightIcon size={16} /> Transition
      </Button>
      <Button onClick={undo} variant="soft" disabled={!canUndo()}>
        <Undo2Icon size={16} /> Undo
      </Button>
      <Button onClick={redo} variant="soft" disabled={!canRedo()}>
        <Redo2Icon size={16} /> Redo
      </Button>
      <Button onClick={exportJson} variant="soft">
        <DownloadIcon size={16} /> Export
      </Button>
      <Button onClick={importJson} variant="soft">
        <UploadIcon size={16} /> Import
      </Button>
      <Button onClick={reset} variant="soft" color="red">
        <Trash2Icon size={16} /> Reset
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
    </div>
  )
}