import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// Preload and cache the font file
const fontDataPromise = fetch(
  new URL("/assets/WorkSans-Medium.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Input sanitization
    const title =
      decodeURIComponent(searchParams.get("title") || "")
        .slice(0, 100)
        .trim() || "Danilo Leal";
    const bgColor = searchParams.get("bgColor") || "#0C0C0D";
    const textColor = searchParams.get("textColor") || "#FFF";

    // Await font loading
    const fontData = await fontDataPromise;

    return new ImageResponse(
      (
        <div
          style={{
            padding: "100px",
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: "column",
            backgroundColor: bgColor,
            backgroundImage: `linear-gradient(30deg, ${bgColor}, #000, ${bgColor}, #281101)`,
          }}
        >
          <p style={{ fontSize: 60, color: textColor, fontWeight: 700 }}>
            {title}
          </p>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p style={{ margin: 0, fontSize: 40, color: textColor }}>
              Danilo Leal
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 25,
                color: "#737373",
              }}
            >
              Software Designer
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Work Sans",
            data: fontData,
            style: "normal",
          },
        ],
      },
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(`Error generating image: ${e.message}`);
      // Return a fallback image or a more informative error response
      return new Response(`Failed to generate the image: ${e.message}`, {
        status: 500,
      });
    }
    // Handle non-Error objects
    console.error(`Unknown error occurred: ${String(e)}`);
    return new Response(`An unknown error occurred`, {
      status: 500,
    });
  }
}
