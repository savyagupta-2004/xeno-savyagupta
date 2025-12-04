const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006";

function extractAuthHeaders(request) {
  const token = request.headers.get("authorization");
  const tenant = request.headers.get("x-tenant-id");
  const email = request.headers.get("x-user-email");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) headers["Authorization"] = token;
  if (tenant) headers["X-Tenant-ID"] = tenant;
  if (email) headers["X-User-Email"] = email;

  return headers;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const endpoint = body.endpoint;
    delete body.endpoint;

    const headers = extractAuthHeaders(request);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy POST error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const endpoint = url.searchParams.get("endpoint");

    const headers = extractAuthHeaders(request);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
