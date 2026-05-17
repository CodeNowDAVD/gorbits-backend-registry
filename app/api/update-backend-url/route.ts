import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.url || !body?.secret) {
    return NextResponse.json(
      { error: "Missing url or secret" },
      { status: 400 }
    );
  }

  if (body.secret !== process.env.UPDATE_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!body.url.startsWith("https://") || !body.url.includes("trycloudflare.com")) {
    return NextResponse.json(
      { error: "Invalid cloudflared URL" },
      { status: 400 }
    );
  }

  const updatedAt = new Date().toISOString();

  await redis.set("active_backend_url", body.url);
  await redis.set("active_backend_updated_at", updatedAt);

  return NextResponse.json({
    ok: true,
    url: body.url,
    updatedAt,
  });
}
