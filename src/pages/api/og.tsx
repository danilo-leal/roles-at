import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "edge",
};

// Uncomment this for local testing
// const fontDataPromise = fetch("http://localhost:3000/WorkSans-Medium.ttf").then(
//   (res) => res.arrayBuffer(),
// );

// Use site domain for production
const fontDataPromise = fetch("https://roles.at/WorkSans-Medium.ttf").then(
  (res) => res.arrayBuffer(),
);

export default async function handler(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);

    const bgColor = searchParams.get("bgColor") || "#281101";
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
            backgroundImage: `linear-gradient(180deg, #000, #000, #101010, #000)`,
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p style={{ fontSize: 60, color: textColor, fontWeight: 700 }}>
              roles.at
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 25,
                color: "#737373",
              }}
            >
              Find high-quality software design and engineering roles.
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
  } catch (e) {
    if (e instanceof Error) {
      console.error(`Error generating image: ${e.message}`);
      return new Response(`Failed to generate the image: ${e.message}`, {
        status: 500,
      });
    } else {
      console.error("Unknown error occurred");
      return new Response(
        "Failed to generate the image due to an unknown error",
        {
          status: 500,
        },
      );
    }
  }
}
