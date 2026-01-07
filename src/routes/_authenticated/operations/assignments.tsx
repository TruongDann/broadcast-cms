import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/operations/assignments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/operations/assignments"!</div>
}
