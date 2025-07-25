import { StrictMode, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import './index.css'

import { Editor } from './features/editor/Editor'
import { sampleGraph } from './features/editor/sampleGraph'
import { useGraphStore } from './features/editor/GraphStore'

function App() {
  const { graph, setGraph } = useGraphStore()

  useEffect(() => {
    if (Object.keys(graph.states).length === 0) setGraph(sampleGraph)
  }, [graph, setGraph])

  return <Editor />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="cyan">
      <App />
    </Theme>
  </StrictMode>,
)