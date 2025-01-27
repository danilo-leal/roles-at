import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { Job } from "@/types/job";
import { supabase } from "@/lib/supabaseClient";
import { JobNotificationEmail } from "@/components/Emails";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send job notification to a single subscriber
async function sendJobNotification(email: string, job: Job) {
  console.log(
    `Attempting to send notification email to ${email} for job: ${job.title}`,
  );

  try {
    const data = await resend.emails.send({
      from: "Victor from Roles.at <hello@roles.at>",
      to: email,
      subject: `New role: ${job.title} at ${job.company}`,
      react: JobNotificationEmail({
        company: job.company,
        title: job.title,
        companySlug: job.company_slug,
      }),
    });

    console.log(`Email sent successfully to ${email}:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    throw error;
  }
}

// Function to notify all subscribers about a new job
export async function notifySubscribers(
  job: Job,
  req?: NextApiRequest,
  res?: NextApiResponse,
) {
  console.log("Starting notification process for job:", job.title);

  try {
    console.log("Querying subscribers table...");
    const client =
      req && res ? createPagesServerClient({ req, res }) : supabase;
    const { data: subscribers, error } = await client
      .from("subscribers")
      .select("email");

    console.log("Query response:", { subscribers, error });

    if (error) {
      console.error("Failed to fetch subscribers:", error);
      throw error;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers found to notify. Query returned:", {
        subscribers,
      });
      return;
    }

    console.log(
      `Found ${subscribers.length} subscribers to notify:`,
      subscribers,
    );

    const results = await Promise.all(
      subscribers.map((subscriber) =>
        sendJobNotification(subscriber.email, job),
      ),
    );

    console.log(`Successfully sent ${results.length} notification emails`);
  } catch (error) {
    console.error("Failed to notify subscribers:", error);
    throw error;
  }
}

// Main API handler for subscription management
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Try to insert the subscriber
    const { error: insertError } = await supabase.from("subscribers").insert([
      {
        email,
        created_at: new Date().toISOString(),
      },
    ]);

    // Handle duplicate email error specifically
    if (insertError?.code === "23505") {
      return res.status(400).json({ error: "Email already subscribed" });
    }

    // Handle other insertion errors
    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return res.status(200).json({ message: "Successfully subscribed" });
  } catch (error) {
    console.error("Subscription error:", error);
    return res.status(500).json({
      error: "Failed to subscribe",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
