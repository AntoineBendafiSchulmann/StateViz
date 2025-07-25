import { describe, it, expect, beforeEach } from 'vitest'
import { useGraphStore } from '../../editor/GraphStore'

describe('GraphStore transitions', () => {
  beforeEach(() => {
    useGraphStore.setState({
      graph: { id: 't', initial: '', states: { a: {}, b: {} } },
      positions: {},
      selectedId: undefined,
      selectedEdge: undefined,
      mode: 'idle',
      sourceId: undefined,
    })
  })

  it('creates then deletes a transition', () => {
    useGraphStore.getState().createTransition('a', 'b', 'X')

    let st = useGraphStore.getState()
    expect(st.graph.states['a']?.on?.['X']?.target).toBe('b')

    st.deleteTransition('a', 'X')


    st = useGraphStore.getState()
    expect(st.graph.states['a']?.on?.['X']).toBeUndefined()
  })

  it('renames a transition', () => {
    const store = useGraphStore.getState()

    store.createTransition('a', 'b', 'OLD')
    store.renameTransition('a', 'OLD', 'NEW')

    const on = useGraphStore.getState().graph.states['a']?.on
    expect(on?.['OLD']).toBeUndefined()
    expect(on?.['NEW']?.target).toBe('b')
  })
})