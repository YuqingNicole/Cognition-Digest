/**
 * Proxy route for /reports/{id}
 * Forwards requests to backend API
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  
  try {
    // Forward to backend
    const backendRes = await fetch(`${BACKEND_URL}/reports/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        // Forward auth headers
        ...(req.headers.get("authorization") && {
          authorization: req.headers.get("authorization")!,
        }),
        ...(req.headers.get("cookie") && {
          cookie: req.headers.get("cookie")!,
        }),
      },
    })

    const data = await backendRes.json()
    
    return new Response(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "content-type": "application/json" },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: {
          code: "PROXY_ERROR",
          message: error instanceof Error ? error.message : "Failed to connect to backend",
        },
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    )
  }
}
