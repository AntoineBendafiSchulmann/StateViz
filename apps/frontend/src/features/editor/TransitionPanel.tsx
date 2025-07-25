import { Dialog, Button, TextField, Flex } from '@radix-ui/themes'
import { useGraphStore } from './GraphStore'

export default function TransitionPanel() {
  const {
    selectedEdge,
    renameTransition,
    deleteTransition,
    setSelectedEdge,
  } = useGraphStore()

  if (!selectedEdge) return null
  const { source, event } = selectedEdge

  const rename = (raw: string) => {
    const e = raw.trim()
    if (e && e !== event) renameTransition(source, event, e)
  }

  const remove = () => deleteTransition(source, event)

  return (
    <Dialog.Root open onOpenChange={() => setSelectedEdge(undefined)}>
      <Dialog.Content className="max-w-[320px]">
        <Dialog.Title>Transition {source} → …</Dialog.Title>

        <Flex direction="column" gap="3">
          <TextField.Root
            defaultValue={event}
            onBlur={(e) => rename(e.currentTarget.value)}
          />
          <Button color="red" onClick={remove}>
            Delete transition
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}