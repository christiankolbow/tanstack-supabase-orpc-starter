import '@/polyfill'

import { experimental_SmartCoercionPlugin as SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { createFileRoute } from '@tanstack/react-router'

import router from '@/orpc/router'
import { CreateTodoInput, DeleteTodoInput, ListTodosInput, TodoRow, TodoStatus, UpdateStatusInput, UpdateTodoInput } from '@/orpc/schema'

const handler = new OpenAPIHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error)
    }),
  ],
  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'TanStack ORPC Playground',
          version: '1.0.0',
        },
        commonSchemas: {
          TodoStatus: { schema: TodoStatus },
          TodoRow: { schema: TodoRow },
          ListTodosInput: { schema: ListTodosInput },
          CreateTodoInput: { schema: CreateTodoInput },
          UpdateTodoInput: { schema: UpdateTodoInput },
          UpdateStatusInput: { schema: UpdateStatusInput },
          DeleteTodoInput: { schema: DeleteTodoInput },
        },
        security: [{ bearerAuth: [] }],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            bearerAuth: {
              token: 'default-token',
            },
          },
        },
      },
    }),
  ],
})

async function handle({ request }: { request: Request }) {
  const { response } = await handler.handle(request, {
    prefix: '/api',
    context: {},
  })

  return response ?? new Response('Not Found', { status: 404 })
}

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})
