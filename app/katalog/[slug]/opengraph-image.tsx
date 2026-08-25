import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { getProductBySlug } from "@/lib/products";

export const runtime = "nodejs";

export const alt = "Duta Mitra Luhur Product";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    return new Response("Not Found", { status: 404 });
  }

  // Read local TTF file
  const fontPath = path.join(process.cwd(), "app/fonts/Fraunces-Medium.ttf");
  const fontData = fs.readFileSync(fontPath);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B1E3A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: '"Fraunces"',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              color: "#D81F3C", // red-signal
              fontSize: 32,
              textTransform: "uppercase",
              letterSpacing: "4px",
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            {product.category.name}
          </div>
          <div
            style={{
              color: "#F8F6F0",
              fontSize: 96,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            {product.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#F8F6F0",
              fontSize: 48,
              opacity: 0.9,
            }}
          >
            Duta Mitra Luhur
          </div>
          <div
            style={{
              color: "#F8F6F0",
              fontSize: 32,
              opacity: 0.7,
              fontFamily: "sans-serif",
            }}
          >
            dutamitraluhur.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: fontData,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
