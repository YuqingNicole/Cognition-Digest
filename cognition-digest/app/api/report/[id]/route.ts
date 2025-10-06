export async function GET(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  return new Response(
    JSON.stringify({ id, report: null, message: "placeholder – implement data source later" }),
    { headers: { "content-type": "application/json" } }
  )
}

export async function POST(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  return new Response(
    JSON.stringify({ id, ok: true, message: "placeholder – create/update not implemented" }),
    { headers: { "content-type": "application/json" } }
  )
}
