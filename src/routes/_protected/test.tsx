import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/test"!</div>
}
