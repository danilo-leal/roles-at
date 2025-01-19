import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const supabase = createPagesServerClient({ req, res });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return res.status(401).json({
          error: "not_authenticated",
          description:
            "The user does not have an active session or is not authenticated",
        });
      }

      const { id } = req.body;

      // Update job posting to approved status
      const { data, error } = await supabase
        .from("job-postings")
        .update({ is_approved: true, is_rejected: false })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: error.message, details: error });
      }

      res.status(200).json({
        message: "Job posting approved",
        data: data,
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
