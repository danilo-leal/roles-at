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

      // Delete from job-postings
      const { error } = await supabase
        .from("job-postings")
        .update({ is_approved: false, is_rejected: true })
        .eq("id", id);

      if (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ message: "Job posting rejected and deleted" });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
