import { z } from 'zod'

export const TodoStatus = z.enum(['open', 'in_progress', 'completed'])
export type TTodoStatus = z.infer<typeof TodoStatus>
export const TodoRow = z.object({
  id: z.number().int(),
  todo: z.string(),
  status: TodoStatus,
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})
export const ListTodosInput = z.object({})
export const CreateTodoInput = z.object({ todo: z.string().min(1) })
export const UpdateTodoInput = z.object({
  id: z.number().int(),
  todo: z.string().min(1),
})
export const UpdateStatusInput = z.object({
  id: z.number().int(),
  status: TodoStatus,
})
export const DeleteTodoInput = z.object({ id: z.number().int() })
export type TTodoRow = z.infer<typeof TodoRow>
