import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

const redis = Redis.fromEnv();

export async function GET() {
  const url = await redis.get<string>("active_backend_url");
  const updatedAt = await redis.get<string>("active_backend_updated_at");

  if (!url) {
    return NextResponse.json(
      { error: "No backend URL registered yet" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    url,
    updatedAt,
  });
}
