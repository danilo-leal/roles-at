import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { createSlug } from "@/utils/slugify";

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
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const supabase = createPagesServerClient({ req, res });
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
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
        description: $('[class*="JobListing_sectionDetail"]').text().trim(),
        salary_range: "N/A",
        is_open: true,
        created_at: new Date().toISOString(),
      };

      console.log("Extracted job details:", jobDetails);

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

      // Check if we have a valid session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Insert the extracted job details into your database
      const { data, error } = await supabase
        .from("job-postings")
        .insert([jobDetails])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
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
    res.status(405).end("Method Not Allowed");
  }
}
