import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { id, company, title, description, salary_range } = req.body;

    // Insert into job_postings
    const { error: insertError } = await supabase.from("job_postings").insert([
      {
        company,
        title,
        description,
        salary_range,
      },
    ]);

    if (insertError) {
      res.status(500).json({ error: insertError.message });
      return;
    }

    // Delete from submissions
    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      res.status(500).json({ error: deleteError.message });
      return;
    }

    res.status(200).json({ message: "Job approved and moved to postings" });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
