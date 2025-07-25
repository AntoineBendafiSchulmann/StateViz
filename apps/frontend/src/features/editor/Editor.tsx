import { useMemo, useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type NodeDragHandler,
  type EdgeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Toolbar } from './Toolbar'
import PropertyPanel from './PropertyPanel'
import TransitionPanel from './TransitionPanel'
import { useGraphStore } from './GraphStore'

const GAP = 120

export function Editor() {
  const {
    graph,
    positions,
    setPos,
    setSelectedId,
    setSelectedEdge,
    mode,
    sourceId,
    setMode,
    createTransition,
    undo,
    redo,
  } = useGraphStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') undo()
      if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) redo()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = Object.keys(graph.states).map((id, i) => ({
      id,
      position: positions[id] ?? { x: GAP * i, y: GAP * i },
      data: { label: id },
    }))

    const es: Edge[] = []

    Object.entries(graph.states).forEach(([from, st]) => {
      if (st.on) {
        Object.values(st.on).forEach((t) =>
          es.push({
            id: `${from}-${t.event}`,
            source: from,
            target: t.target,
            label: t.event,
            animated: true,
          }),
        )
      }
    })

    return { nodes: ns, edges: es }
  }, [graph, positions])

  const onNodeClick: NodeMouseHandler = (_, node) => {
    if (mode === 'pick-target') {
      if (!sourceId) setMode('pick-target', node.id)
      else if (sourceId !== node.id) {
        const evt = prompt('Event name ?', 'EVENT')?.trim()
        if (evt) createTransition(sourceId, node.id, evt)
      }
    } else {
      setSelectedId(node.id)
    }
  }

  const onEdgeClick: EdgeMouseHandler = (_, edge) => {
    const [source, event] = edge.id.split('-')
    if (source && event) setSelectedEdge({ source, event })
  }

  const onNodeDragStop: NodeDragHandler = (_, node) =>
    setPos(node.id, node.position)

  return (
    <div className="h-screen">
      <Toolbar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onNodeDragStop={onNodeDragStop}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <PropertyPanel />
      <TransitionPanel />
    </div>
  )
}