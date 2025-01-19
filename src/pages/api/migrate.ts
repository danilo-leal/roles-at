import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Resend } from "resend";
import { SubmissionConfirmationEmail } from "@/components/Emails";
import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { createSlug } from "@/utils/slugify";

const resend = new Resend(process.env.RESEND_API_KEY);

// Define the JobDetails type
type JobDetails = {
  id: string;
  company: string;
  avatar_img: string;
  location: string;
  title: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  application_link: string;
  notification_email?: string;
};

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
  console.log("Received request method:", req.method);

  if (req.method === "POST") {
    try {
      const supabase = createPagesServerClient({ req, res });
      const { url, notification_email } = req.body;

      if (!url || !notification_email) {
        return res
          .status(400)
          .json({ error: "URL and notification email are required" });
      }

      console.log("Fetching URL:", url);

      // Fetch the content from the provided URL
      const { data: htmlContent } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      console.log("HTML content fetched successfully");

      // Parse the HTML content
      const $ = cheerio.load(htmlContent);

      // Extract job details
      const jobDetails: JobDetails = {
        id: uuidv4(),
        company: createSlug(
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
        description: extractJobDescription($),
        application_link:
          $('[class*="JobListing_applicationCTA"] a').attr("href") || "",
        salary_range: "N/A",
        is_open: true,
        created_at: new Date().toISOString(),
        notification_email,
      };

      console.log("Extracted job details:", jobDetails);
      console.log(
        "Application link element:",
        $('a[class*="JobListing_applicationCTA"]').length,
      );
      console.log(
        "Application link href:",
        $('a[class*="JobListing_applicationCTA"]').attr("href"),
      );

      // Clean up the data
      Object.keys(jobDetails).forEach((key) => {
        if (typeof jobDetails[key as keyof JobDetails] === "string") {
          (jobDetails as Record<keyof JobDetails, unknown>)[
            key as keyof JobDetails
          ] = (jobDetails[key as keyof JobDetails] as string)
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
        console.error("Supabase insert error:", error);
        throw error;
      }

      if (jobDetails.notification_email) {
        try {
          const emailData = await resend.emails.send({
            from: "Your Name <onboarding@resend.dev>", // Use your verified domain
            to: jobDetails.notification_email,
            subject: "Job Listing Submission Confirmation",
            react: SubmissionConfirmationEmail({
              company: jobDetails.company,
              title: jobDetails.title,
            }),
          });

          console.log("Email sent:", emailData);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }

      res
        .status(200)
        .json({ message: "Job posting migrated successfully", data });
    } catch (error) {
      console.error("Error migrating job posting:", error);
      res.status(500).json({
        error: "Failed to migrate job posting",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
