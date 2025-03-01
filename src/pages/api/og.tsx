import { ImageResponse } from "@vercel/og";
import { descriptionOg } from "../../../next-seo.config";

export const config = {
  runtime: "edge",
};

// Use site domain for prod
const fontDataPromise = fetch("https://roles.at/WorkSans-Medium.ttf").then(
  (res) => res.arrayBuffer(),
);

const logo =
  "data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 46h2v-4h-2v4Zm-6-11v2h4v-2h-4Zm-1-23.5h-2v4h2v-4ZM24 42c-9.941 0-18-8.059-18-18H2c0 12.15 9.85 22 22 22v-4ZM6 24c0-9.941 8.059-18 18-18V2C11.85 2 2 11.85 2 24h4ZM24 6c9.941 0 18 8.059 18 18h4c0-12.15-9.85-22-22-22v4Zm-6 7.5V35h4V13.5h-4Zm2 2c1.806 0 3.356-.031 4.774.007 1.414.038 2.507.144 3.34.364.813.216 1.211.497 1.43.773.214.269.456.78.456 1.856h4c0-1.674-.383-3.162-1.326-4.347-.936-1.177-2.226-1.802-3.537-2.149-1.293-.342-2.762-.455-4.255-.495-1.488-.04-3.189-.009-4.882-.009v4Zm10 3c0 1.178-.19 1.88-.394 2.293-.186.375-.42.59-.721.748-.787.412-1.98.459-3.885.459v4c1.594 0 3.902.047 5.74-.916a5.571 5.571 0 0 0 2.451-2.517c.561-1.134.81-2.495.81-4.067h-4ZM25 24c0 2-.001 2-.002 2H24.979h.014c.021.001.064.003.125.01a5.304 5.304 0 0 1 2.3.798C28.544 27.53 30 29.113 30 33h4c0-5.114-2.042-8.03-4.418-9.557a9.302 9.302 0 0 0-4.098-1.417 6.563 6.563 0 0 0-.458-.026h-.023C25 22 25 22 25 24Zm5 9c0 2.354 1.07 4.268 2.849 5.332 1.717 1.026 3.85 1.118 5.808.437C42.685 37.37 46 32.837 46 25.5h-4c0 6.163-2.685 8.805-4.657 9.491-1.041.362-1.91.226-2.442-.093-.47-.28-.9-.829-.9-1.898h-4ZM20 11.5h-3v4h3v-4ZM42 24v1.5h4V24h-4Z' fill='white'/%3E%3C/svg%3E";

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
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              width={64}
              height={64}
              alt="Logo"
              src={logo}
              style={{
                position: "absolute",
                top: 0,
              }}
            />
            <p style={{ fontSize: 120, color: textColor, fontWeight: 700 }}>
              {title}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 34,
                color: textColor,
                opacity: 0.3,
              }}
            >
              {company ? `Role at ${company}.` : subtitle}
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
