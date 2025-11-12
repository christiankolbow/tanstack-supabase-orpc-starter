import { queryOptions } from '@tanstack/react-query'
import { client } from '@/orpc/client'

export const todosQuery = queryOptions({
  queryKey: ['todos'],
  queryFn: () => client.listTodos({}),
})