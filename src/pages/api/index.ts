import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { validateMethod, handleApiError } from "@/lib/api-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!validateMethod(req, res, ["GET"])) return;

  try {
    const { data, error } = await supabase
      .from("job-postings")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({ data });
  } catch (error) {
    handleApiError(res, error, "Failed to fetch job postings");
  }
}
