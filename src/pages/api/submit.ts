import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { resend } from "@/lib/resend";
import { SubmissionConfirmationEmail } from "@/components/Emails";
import { v4 as uuidv4 } from "uuid";
import { createSlug } from "@/utils/slugify";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const {
        company,
        title,
        description,
        salary_range,
        location,
        avatar_img,
        application_link,
        notification_email,
      } = req.body;

      // Validate input
      if (!company || !title || !description || !notification_email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const job_posting_id = uuidv4();
      const company_slug = createSlug(company);

      // Insert directly into job-postings table
      const { data: jobPostingData, error } = await supabase
        .from("job-postings")
        .insert([
          {
            id: job_posting_id,
            company,
            company_slug,
            title,
            description,
            salary_range,
            location,
            avatar_img,
            is_approved: false,
            application_link,
            notification_email,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(500).json({ error: error.message });
      }

      // Send the email using Resend
      try {
        await resend.emails.send({
          from: "Danilo from Roles.at <onboarding@resend.dev>",
          to: notification_email,
          subject: "Roles.at: Job Listing Submitted",
          react: SubmissionConfirmationEmail({ company, title }),
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }

      res.status(201).json({
        message: "Job posting submitted for approval",
        data: jobPostingData,
      });
    } catch (error) {
      console.error("Unexpected error in submit handler:", error);
      res.status(500).json({
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
