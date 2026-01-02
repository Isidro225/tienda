import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || "panaderia";

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary no está configurado (faltan variables de entorno)." },
      { status: 400 }
    );
  }

  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature: sha1 of "folder=...&timestamp=..." + api_secret
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({
    ok: true,
    cloudName,
    apiKey,
    timestamp,
    folder,
    signature,
  });
}
