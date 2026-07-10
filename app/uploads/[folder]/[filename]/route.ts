import { localUploadResponse } from "@/lib/local-upload-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string; folder: string }> },
) {
  const { filename, folder } = await params;
  return localUploadResponse(folder, filename);
}

export async function HEAD(
  _request: Request,
  { params }: { params: Promise<{ filename: string; folder: string }> },
) {
  const response = await GET(_request, { params });
  return new Response(null, { headers: response.headers, status: response.status });
}
