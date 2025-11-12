import { os } from '@orpc/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import {
  CreateTodoInput,
  DeleteTodoInput,
  ListTodosInput,
  TodoRow,
  UpdateStatusInput,
  UpdateTodoInput,
} from '@/orpc/schema'

export const listTodos = os.input(ListTodosInput).output(TodoRow.array()).handler(async () => {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data?.map((r) => ({ ...r, id: Number(r.id) })) ?? []
})

export const createTodo = os.input(CreateTodoInput).output(TodoRow).handler(async ({ input }) => {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('todos')
    .insert({ todo: input.todo, status: 'open' })
    .select()
    .single()
  if (error) throw error
  return { ...data, id: Number(data.id) }
})

export const updateTodo = os.input(UpdateTodoInput).output(TodoRow).handler(async ({ input }) => {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('todos')
    .update({ todo: input.todo, updated_at: new Date().toISOString() })
    .eq('id', input.id)
    .select()
    .single()
  if (error) throw error
  return { ...data, id: Number(data.id) }
})

export const updateTodoStatus = os.input(UpdateStatusInput).output(TodoRow).handler(async ({ input }) => {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from('todos')
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq('id', input.id)
    .select()
    .single()
  if (error) throw error
  return { ...data, id: Number(data.id) }
})

export const deleteTodo = os.input(DeleteTodoInput).output(TodoRow).handler(async ({ input }) => {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from('todos').delete().eq('id', input.id).select().single()
  if (error) throw error
  return { ...data, id: Number(data.id) }
})
