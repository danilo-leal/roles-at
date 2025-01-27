import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { RejectionEmail } from "@/components/Emails";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Approve handler started");
  console.log("RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);

  if (req.method === "POST") {
    try {
      const supabase = createPagesServerClient({ req, res });
      console.log("Supabase client created");

      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Session retrieved:", session ? "Yes" : "No");

      if (!session) {
        console.log("No active session, returning 401");
        return res.status(401).json({
          error: "not_authenticated",
          description:
            "The user does not have an active session or is not authenticated",
        });
      }

      const { id } = req.body;
      console.log("Job posting ID:", id);

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

      console.log("Job posting data:", jobPosting);

      // Update job posting to approved status
      const { error: updateError } = await supabase
        .from("job-postings")
        .update({ is_approved: false, is_rejected: true })
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        return res.status(500).json({ error: updateError.message });
      }

      console.log("Job posting updated successfully");

      if (jobPosting.notification_email) {
        console.log(
          "Attempting to send email to:",
          jobPosting.notification_email,
        );
        try {
          const data = await resend.emails.send({
            from: "Roles.at <hello@roles.at>",
            to: jobPosting.notification_email,
            subject: "Roles.at: Job Listing Rejected",
            react: RejectionEmail({
              company: jobPosting.company,
              title: jobPosting.title,
            }),
          });

          console.log("Email sent:", data);
        } catch (error) {
          console.error("Error sending email:", error);
          console.error("Error details:", JSON.stringify(error, null, 2));
        }
      } else {
        console.log("No notification email provided for job posting");
      }

      console.log("Sending success response");
      res.status(200).json({ message: "Job posting rejected" });
    } catch (error) {
      console.error("Unexpected error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      res.status(500).json({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  } else {
    console.log("Method not allowed:", req.method);
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
