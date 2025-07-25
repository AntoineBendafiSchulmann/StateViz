import { StateCreator } from 'zustand'

export interface HistoryFns {
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const clone = <T,>(o: T): T =>
  typeof structuredClone === 'function'
    ? structuredClone(o)
    : JSON.parse(JSON.stringify(o))

interface Snapshot<S> {
  graph: S extends { graph: infer G } ? G : never
  positions: S extends { positions: infer P } ? P : never
}

export function withHistory<
  S extends {
    graph: unknown
    positions: unknown
    selectedId?: unknown
    selectedEdge?: unknown
  }
>(config: StateCreator<S>, limit = 30): StateCreator<S & HistoryFns> {
  return (set, get, store) => {
    const past: Snapshot<S>[] = []
    const future: Snapshot<S>[] = []

    const capture = () => {
      const { graph, positions } = get()
      past.push(clone({ graph, positions } as Snapshot<S>))
      if (past.length > limit) past.shift()
      future.length = 0
    }

    const setHist: typeof set = (partial) => {
      capture()
      set(partial as Partial<S & HistoryFns>)
    }

    const base = config(setHist, get, store) as S

    const restore = (snap: Snapshot<S>) => {
      store.setState(
        {
          ...get(),
          graph: snap.graph,
          positions: snap.positions,
          selectedId: undefined,
          selectedEdge: undefined,
        } as S & HistoryFns,
        true,
      )
    }

    const undo = () => {
      if (!past.length) return
      const snap = past.pop()!
      future.push(
        clone({ graph: get().graph, positions: get().positions } as Snapshot<S>),
      )
      restore(snap)
    }

    const redo = () => {
      if (!future.length) return
      const snap = future.pop()!
      past.push(
        clone({ graph: get().graph, positions: get().positions } as Snapshot<S>),
      )
      restore(snap)
    }

    return {
      ...base,
      undo,
      redo,
      canUndo: () => past.length > 0,
      canRedo: () => future.length > 0,
    }
  }
}