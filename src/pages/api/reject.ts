import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { RejectionEmail } from "@/components/Emails";

const resend = new Resend(process.env.RESEND_API_KEY);

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

      // Update job posting to rejected status
      const { error: updateError } = await supabase
        .from("job-postings")
        .update({ is_approved: false, is_rejected: true })
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        return res.status(500).json({ error: updateError.message });
      }

      if (jobPosting && jobPosting.notification_email) {
        if (!process.env.RESEND_API_KEY) {
          console.error("Resend API key is not set");
        } else {
          try {
            const result = await resend.emails.send({
              from: "daniloleal09@gmail.com", // Use Resend's default domain for testing
              to: jobPosting.notification_email,
              subject: "Your Job Listing Has Been Repproved", // or "Update on Your Job Listing Submission" for reject
              react: RejectionEmail({
                // or RejectionEmail for reject
                company: jobPosting.company,
                title: jobPosting.title,
              }),
            });
            console.log("Email sent successfully:", result);
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            if (emailError instanceof Error) {
              console.error("Error details:", emailError.message);
            }
          }
        }
      }

      res.status(200).json({ message: "Job posting rejected" });
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
