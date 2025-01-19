import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { resend } from "@/lib/resend";
import { ApprovalEmail } from "@/components/Emails";

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

      // Fetch the job posting before updating
      const { data: jobPosting, error: fetchError } = await supabase
        .from("job-postings")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        return res.status(500).json({ error: fetchError.message });
      }

      // Update job posting to approved status
      const { error: updateError } = await supabase
        .from("job-postings")
        .update({ is_approved: true, is_rejected: false })
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        return res.status(500).json({ error: updateError.message });
      }

      if (jobPosting && jobPosting.notification_email) {
        try {
          await resend.emails.send({
            from: "daniloleal09@gmail.com",
            to: jobPosting.notification_email,
            subject: "Your Job Listing Has Been Approved",
            react: ApprovalEmail({
              company: jobPosting.company,
              title: jobPosting.title,
            }),
          });
        } catch (emailError) {
          console.error("Error sending approval email:", emailError);
        }
      }

      res.status(200).json({ message: "Job posting approved" });
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
