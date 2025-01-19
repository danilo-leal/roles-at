import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { resend } from "@/lib/resend";
import ConfirmationEmail from "@/components/ConfirmationEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { company, title, description, salary_range, submitter_email } =
      req.body;

    // Validate input
    if (!company || !title || !description || !submitter_email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Insert into submissions table
    const { data: submissionData, error } = await supabase
      .from("submissions")
      .insert([
        {
          company,
          title,
          description,
          salary_range,
          submitter_email,
        },
      ]);

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
      .json({ message: "Submission received", data: submissionData });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
