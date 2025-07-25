import { z } from 'zod';


export type Transition = {
  event: string;
  target: string;
};

export type State = {
  type?: 'regular' | 'final';
  on?: Record<string, Transition>;
  states?: Record<string, State>;
};

export type Graph = {
  id: string;
  initial: string;
  states: Record<string, State>;
};


const TransitionSchema = z.object({
  event: z.string(),
  target: z.string(),
});

const StateSchema: z.ZodType<State> = z.lazy(() =>
  z.object({
    type: z.enum(['regular', 'final']).default('regular').optional(),
    on: z.record(TransitionSchema).optional(),
    states: z.record(StateSchema).optional(),
  }),
);

export const GraphSchema: z.ZodType<Graph> = z.object({
  id: z.string(),
  initial: z.string(),
  states: z.record(StateSchema),
});