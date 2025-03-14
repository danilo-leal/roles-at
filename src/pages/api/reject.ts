import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { RejectionEmail } from "@/components/Emails";
import {
  validateMethod,
  validateRequiredFields,
  handleApiError,
  sendEmail,
} from "@/lib/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!validateMethod(req, res, ["POST"])) return;

  try {
    const supabase = createPagesServerClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({
        error: "not_authenticated",
        description: "The user does not have an active session or is not authenticated",
      });
    }

    const validationError = validateRequiredFields(req.body, ["id"]);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { id } = req.body;

    // Fetch the job posting before updating
    const { data: jobPosting, error: fetchError } = await supabase
      .from("job-postings")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    // Update job posting to rejected status
    const { error: updateError } = await supabase
      .from("job-postings")
      .update({ is_approved: false, is_rejected: true })
      .eq("id", id);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    if (jobPosting.notification_email) {
      await sendEmail({
        from: "Roles.at <hello@roles.at>",
        to: jobPosting.notification_email,
        subject: "Job Listing Rejected",
        react: RejectionEmail({
          company: jobPosting.company,
          title: jobPosting.title,
        }),
      });
    }

    res.status(200).json({ message: "Job posting rejected" });
  } catch (error) {
    handleApiError(res, error);
  }
}
