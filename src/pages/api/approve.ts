import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { ApprovalEmail } from "@/components/Emails";
import { notifySubscribers } from "./subscribe";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

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

      if (!id) {
        return res.status(400).json({ error: 'Job ID is required' });
      }

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
        .update({ is_approved: true, is_rejected: false })
        .eq("id", id);

      if (updateError) {
        console.error("Update error:", updateError);
        return res.status(500).json({ error: updateError.message });
      }

      console.log("Job posting updated successfully");

      // Send approval email to the job poster
      if (jobPosting.notification_email) {
        console.log(
          "Attempting to send approval email to:",
          jobPosting.notification_email,
        );
        try {
          const approvalEmailResult = await resend.emails.send({
            from: "Danilo from Roles.at <onboarding@resend.dev>",
            to: jobPosting.notification_email,
            subject: "Roles.at: Job Listing Approved",
            react: ApprovalEmail({
              company: jobPosting.company,
              title: jobPosting.title,
            }),
          });
          console.log("Approval email sent successfully:", approvalEmailResult);
        } catch (error) {
          console.error("Error sending approval email:", error);
        }
      }

      // Send notifications to all subscribers
      try {
        console.log("Starting subscriber notifications");
        await notifySubscribers(jobPosting);
        console.log("Subscriber notifications completed successfully");
      } catch (error) {
        console.error("Error sending subscriber notifications:", error);
        // Don't throw here, as we still want to return success for the approval
      }

      console.log("Sending success response");
      res.status(200).json({ message: "Job posting approved and notifications sent" });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({
        error: "Failed to approve job",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    console.log("Method not allowed:", req.method);
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
