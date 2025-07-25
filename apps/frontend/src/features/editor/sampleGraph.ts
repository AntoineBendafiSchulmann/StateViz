import { GraphSchema } from '@stateviz/core';

export const sampleGraph = GraphSchema.parse({
  id: 'login',
  initial: 'idle',
  states: {
    idle: { on: { SUBMIT: { event: 'SUBMIT', target: 'checking' } } },
    checking: {
      on: {
        SUCCESS: { event: 'SUCCESS', target: 'success' },
        FAIL: { event: 'FAIL', target: 'error' },
      },
    },
    success: { type: 'final' },
    error: { on: { RETRY: { event: 'RETRY', target: 'idle' } } },
  },
});