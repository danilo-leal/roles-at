import { ImageResponse } from "@vercel/og";
import { descriptionOg } from "../../../next-seo.config";

export const config = {
  runtime: "edge",
};

// Use site domain for prod
const fontDataPromise = fetch("https://roles.at/WorkSans-Medium.ttf").then(
  (res) => res.arrayBuffer(),
);

export default async function handler(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const textColor = searchParams.get("textColor") || "#FFF";
    const title = searchParams.get("title") || "roles.at";
    const company = searchParams.get("company");
    const subtitle = searchParams.get("subtitle") || descriptionOg;
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
            backgroundColor: "#0d0d0d",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              // alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {company ? (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  // alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <p
                  style={{
                    backgroundColor: "#FFF",
                    fontSize: 36,
                    color: textColor,
                    opacity: 0.6,
                    margin: 0,
                  }}
                >
                  Role at {company}
                </p>
                <p
                  style={{
                    fontSize: 80,
                    color: textColor,
                    fontWeight: 700,
                    margin: 0,
                  }}
                >
                  {title}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: 120, color: textColor, fontWeight: 700 }}>
                {title}
              </p>
            )}
            <p
              style={{
                margin: 0,
                width: 600,
                textAlign: "center",
                fontSize: 34,
                color: textColor,
                opacity: 0.3,
              }}
            >
              {subtitle}
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
