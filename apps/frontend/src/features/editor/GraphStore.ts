import { create } from 'zustand'
import { withHistory } from '../../lib/history'
import { Graph, Transition } from '@stateviz/core'

type Mode = 'idle' | 'pick-target'

interface GraphState {
  graph: Graph
  setGraph: (g: Graph) => void
  positions: Record<string, { x: number; y: number }>
  setPos: (id: string, pos: { x: number; y: number }) => void
  selectedId?: string
  setSelectedId: (id?: string) => void
  selectedEdge?: { source: string; event: string }
  setSelectedEdge: (edge?: { source: string; event: string }) => void
  mode: Mode
  sourceId?: string
  setMode: (m: Mode, source?: string) => void
  createTransition: (src: string, tgt: string, evt: string) => void
  deleteTransition: (src: string, evt: string) => void
  renameTransition: (src: string, evt: string, newEvt: string) => void
}

const HISTORY_LIMIT = 4

export const useGraphStore = create(
  withHistory<GraphState>(
    (set) => ({
      graph: { id: 'empty', initial: '', states: {} },
      setGraph: (graph) => set({ graph }),

      positions: {},
      setPos: (id, pos) =>
        set((s) => ({ positions: { ...s.positions, [id]: pos } })),

      selectedId: undefined,
      setSelectedId: (id) =>
        set({ selectedId: id, selectedEdge: undefined }),

      selectedEdge: undefined,
      setSelectedEdge: (edge) =>
        set({ selectedEdge: edge, selectedId: undefined }),

      mode: 'idle',
      sourceId: undefined,
      setMode: (mode, sourceId) => set({ mode, sourceId }),

      createTransition: (src, tgt, evt) =>
        set((s) => {
          const from = s.graph.states[src] ?? {}
          const on = { ...(from.on ?? {}), [evt]: { event: evt, target: tgt } as Transition }
          return {
            graph: {
              ...s.graph,
              states: { ...s.graph.states, [src]: { ...from, on } },
            },
            mode: 'idle',
            sourceId: undefined,
          }
        }),

      deleteTransition: (src, evt) =>
        set((s) => {
          const from = s.graph.states[src]
          if (!from?.on?.[evt]) return s

          const { [evt]: _, ...rest } = from.on
          const nextStates = {
            ...s.graph.states,
            [src]: Object.keys(rest).length
              ? { ...from, on: rest }
              : { ...from, on: undefined },
          }

          return {
            ...s,
            graph: { ...s.graph, states: nextStates },
            selectedEdge: undefined,
          }
        }),

      renameTransition: (src, evt, newEvt) =>
        set((s) => {
          if (!newEvt || newEvt === evt) return s
          const from = s.graph.states[src]
          if (!from?.on?.[evt]) return s

          const { target } = from.on[evt]
          const on = { ...from.on }
          delete on[evt]
          on[newEvt] = { event: newEvt, target }

          return {
            ...s,
            graph: { ...s.graph, states: { ...s.graph.states, [src]: { ...from, on } } },
            selectedEdge: { source: src, event: newEvt },
          }
        }),
    }),
    HISTORY_LIMIT,
  ),
)

const STORAGE_KEY = 'stateviz-store'

const saved = typeof localStorage !== 'undefined'
  ? localStorage.getItem(STORAGE_KEY)
  : null

if (saved) {
  const data = JSON.parse(saved)
  useGraphStore.setState({
    graph: data.graph ?? { id: 'empty', initial: '', states: {} },
    positions: data.positions ?? {},
  })
}

useGraphStore.subscribe((state) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ graph: state.graph, positions: state.positions }),
  )
})