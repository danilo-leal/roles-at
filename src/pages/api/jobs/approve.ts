import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("API route hit"); // Add this line
  if (req.method === "POST") {
    let supabase;
    try {
      console.log("Request body:", req.body); // Add this line

      // Create a Supabase client for the server
      supabase = createServerSupabaseClient({ req, res });

      // Check if the user is authenticated
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session found");
        return res.status(401).json({
          error: "not_authenticated",
          description:
            "The user does not have an active session or is not authenticated",
        });
      }

      console.log("Session found:", session.user.email);

      const { id, company, title, description, salary_range } = req.body;

      console.log("Attempting to insert job posting:", {
        company,
        title,
        description,
        salary_range,
      });

      // Insert into job_postings
      const { data: insertData, error: insertError } = await supabase
        .from("job_postings")
        .insert([
          {
            company,
            title,
            description,
            salary_range,
          },
        ])
        .select();

      if (insertError) {
        console.error("Insert error:", insertError);
        return res.status(500).json({ error: insertError.message });
      }

      console.log("Job posting inserted successfully:", insertData);

      console.log("Attempting to delete submission:", id);

      // Delete from submissions
      const { error: deleteError } = await supabase
        .from("submissions")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return res.status(500).json({ error: deleteError.message });
      }

      console.log("Submission deleted successfully");

      res
        .status(200)
        .json({
          message: "Job approved and moved to postings",
          data: insertData,
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      res
        .status(500)
        .json({
          error: "An unexpected error occurred",
          details: error.message,
          stack: error.stack,
        });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
