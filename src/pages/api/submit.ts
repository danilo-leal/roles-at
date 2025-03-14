import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { SubmissionConfirmationEmail } from "@/components/Emails";
import { v4 as uuidv4 } from "uuid";
import { createSlug } from "@/utils/slugify";
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
    const {
      company,
      company_site,
      title,
      description,
      salary_range,
      location,
      avatar_img,
      application_link,
      notification_email,
    } = req.body;

    const validationError = validateRequiredFields(req.body, [
      "company",
      "title",
      "description",
      "notification_email",
    ]);

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const job_posting_id = uuidv4();
    const company_slug = createSlug(company);
    const title_slug = createSlug(title);

    if (!company_slug) {
      return res.status(400).json({ error: "Invalid company name" });
    }

    const { data: jobPostingData, error } = await supabase
      .from("job-postings")
      .insert([
        {
          id: job_posting_id,
          company,
          company_slug,
          company_site,
          title,
          title_slug,
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
      return res.status(500).json({ error: error.message });
    }

    await sendEmail({
      from: "Danilo from Roles.at <hello@roles.at>",
      to: notification_email,
      subject: "Job Listing Submitted",
      react: SubmissionConfirmationEmail({ company, title }),
    });

    res.status(201).json({
      message: "Job posting submitted for approval",
      data: jobPostingData,
    });
  } catch (error) {
    handleApiError(res, error);
  }
}
