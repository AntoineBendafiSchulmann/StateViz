import { Dialog, Button, TextField, Flex } from '@radix-ui/themes'
import { useGraphStore } from './GraphStore'

export default function PropertyPanel() {
  const { selectedId, graph, setSelectedId } = useGraphStore()

  if (!selectedId || !graph.states[selectedId]) return null

  const rename = (raw: string) => {
    const id = raw.trim()
    if (!id || id === selectedId) return

    useGraphStore.setState(s => {
      const g = { ...s.graph }
      g.states[id] = g.states[selectedId]!
      delete g.states[selectedId]
      return { ...s, graph: g, selectedId: undefined }
    })
  }

  const remove = () =>
    useGraphStore.setState(s => {
      const g = { ...s.graph }
      delete g.states[selectedId]
      return { ...s, graph: g, selectedId: undefined }
    })

  return (
    <Dialog.Root open onOpenChange={() => setSelectedId(undefined)}>
      <Dialog.Content className="max-w-[320px]">
        <Dialog.Title>State "{selectedId}"</Dialog.Title>

        <Flex direction="column" gap="3">
          <TextField.Root defaultValue={selectedId} onBlur={e => rename(e.currentTarget.value)} />
          <Button color="red" onClick={remove}>
            Delete state
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}