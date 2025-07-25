import { GraphSchema, Graph } from './graph.js'
import { ZodError } from 'zod'


export function validateGraph(data: unknown):
  | { ok: true;  value: Graph }
  | { ok: false; error: string } {

  try {
    const value = GraphSchema.parse(data)
    return { ok: true, value }
  } catch (err) {
    const msg =
      err instanceof ZodError ? err.issues.map(i => i.message).join(', ') : 'Unknown error'
    return { ok: false, error: msg }
  }
}