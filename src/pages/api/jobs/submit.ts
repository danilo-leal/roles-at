import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { company, title, desc, salary_range, submitter_email } = req.body;

    // Validate input
    if (!company || !title || !desc || !submitter_email) {
      console.log("Missing fields:", { company, title, desc, submitter_email });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Insert into submissions table
    const { data, error } = await supabase.from("submissions").insert([
      {
        company,
        title,
        desc,
        salary_range,
        submitter_email,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ message: "Submission received", data });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
