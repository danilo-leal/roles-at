import { NextApiRequest, NextApiResponse } from "next";
import { Job } from "@/types/job";
import { supabase } from "@/lib/supabaseClient";
import { JobNotificationEmail } from "@/components/Emails";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import {
  validateMethod,
  handleApiError,
  sendEmail,
  validateRequiredFields,
} from "@/lib/api-utils";

// Helper function to send job notification to a single subscriber
async function sendJobNotification(email: string, job: Job) {
  return sendEmail({
    from: "Victor from Roles.at <hello@roles.at>",
    to: email,
    subject: `New role: ${job.title} at ${job.company}`,
    react: JobNotificationEmail({
      company: job.company,
      title: job.title,
      companySlug: job.company_slug,
    }),
  });
}

// Function to notify all subscribers about a new job
export async function notifySubscribers(
  job: Job,
  req?: NextApiRequest,
  res?: NextApiResponse,
) {
  try {
    const client = req && res ? createPagesServerClient({ req, res }) : supabase;
    const { data: subscribers, error } = await client
      .from("subscribers")
      .select("email");

    if (error) {
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      return;
    }

    await Promise.all(
      subscribers.map((subscriber) => sendJobNotification(subscriber.email, job))
    );
  } catch (error) {
    throw error;
  }
}

// Main API handler for subscription management
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!validateMethod(req, res, ["POST"])) return;

  try {
    const { email } = req.body;

    const validationError = validateRequiredFields(req.body, ["email"]);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address format" });
    }

    const { error: insertError } = await supabase.from("subscribers").insert([
      {
        email,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError?.code === "23505") {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    if (insertError) {
      throw insertError;
    }

    return res.status(200).json({ message: "Successfully subscribed" });
  } catch (error) {
    handleApiError(res, error, "Failed to subscribe");
  }
}
