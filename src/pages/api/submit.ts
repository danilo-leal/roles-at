import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { resend } from "@/lib/resend";
import ConfirmationEmail from "@/components/ConfirmationEmail";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const {
      company,
      title,
      description,
      salary_range,
      submitter_email,
      location,
      avatar_img,
    } = req.body;

    // Validate input
    if (!company || !title || !description || !submitter_email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const job_posting_id = uuidv4(); // Generate a new UUID for the job posting

    // Insert directly into job-postings table
    const { data: jobPostingData, error } = await supabase
      .from("job-postings")
      .insert([
        {
          id: job_posting_id,
          company,
          title,
          description,
          salary_range,
          submitter_email,
          location,
          avatar_img,
          is_approved: false, // Add this field to indicate it needs approval
        },
      ])
      .select();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Send the email using Resend
    try {
      await resend.emails.send({
        from: "daniloleal09@gmail.com",
        to: submitter_email,
        subject: "Job Submission Received",
        react: ConfirmationEmail({ company, title, email: submitter_email }),
      });
    } catch (emailError: unknown) {
      console.error("Error sending email:", emailError);
      // You might choose to notify the user even if email fails
    }

    res
      .status(201)
      .json({
        message: "Job posting submitted for approval",
        data: jobPostingData,
      });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
