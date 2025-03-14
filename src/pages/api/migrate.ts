import type { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/job";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { SubmissionConfirmationEmail } from "@/components/Emails";
import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { createSlug } from "@/utils/slugify";
import {
  validateMethod,
  validateRequiredFields,
  handleApiError,
  sendEmail,
} from "@/lib/api-utils";

const extractJobDescription = ($: cheerio.CheerioAPI): string => {
  const descriptionElement = $('[class*="RichTextEditor_text"]');
  if (descriptionElement.length) {
    // Preserve the HTML structure inside the RichTextEditor_text element
    return descriptionElement.html() || "";
  }
  return "";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!validateMethod(req, res, ["POST"])) return;

  try {
    const supabase = createPagesServerClient({ req, res });
    const { url, notification_email } = req.body;

    const validationError = validateRequiredFields(req.body, ["url", "notification_email"]);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Fetch the content from the provided URL
    const { data: htmlContent } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Parse the HTML content
    const $ = cheerio.load(htmlContent);

    // Extract job details
    const jobDetails: Job = {
      id: uuidv4(),
      company: $('[class*="JobListing_teamName"]').first().text().trim(),
      company_slug: createSlug(
        $('[class*="JobListing_teamName"]').first().text().trim(),
      ),
      avatar_img:
        $('[class*="JobListing_headerActions"] img').first().attr("src") ||
        "",
      location: $('[class*="JobListing_locationTitle"]')
        .first()
        .text()
        .trim(),
      title: $('[class*="JobListing_title"]').first().text().trim(),
      title_slug: createSlug(
        $('[class*="JobListing_title"]').first().text().trim(),
      ),
      description: extractJobDescription($),
      application_link:
        $('[class*="JobListing_applicationCTA"] a').attr("href") || "",
      salary_range: "N/A",
      is_open: true,
      created_at: new Date().toISOString(),
      notification_email,
    };

    // Clean up the data
    Object.keys(jobDetails).forEach((key) => {
      if (typeof jobDetails[key as keyof Job] === "string") {
        (jobDetails as Record<keyof Job, unknown>)[key as keyof Job] = (
          jobDetails[key as keyof Job] as string
        )
          .replace(/\s+/g, " ")
          .trim();
      }
    });

    // Insert the extracted job details into your database
    const { data, error } = await supabase
      .from("job-postings")
      .insert([jobDetails])
      .select();

    if (error) {
      throw error;
    }

    if (jobDetails.notification_email) {
      await sendEmail({
        from: "Danilo from Roles.at <hello@roles.at>",
        to: jobDetails.notification_email,
        subject: "Roles.at: Job Listing Submitted",
        react: SubmissionConfirmationEmail({
          company: jobDetails.company,
          title: jobDetails.title,
        }),
      });
    }

    res
      .status(200)
      .json({ message: "Job posting migrated successfully", data });
  } catch (error) {
    handleApiError(res, error, "Failed to migrate job posting");
  }
}
