import { NextApiRequest, NextApiResponse } from "next";
import { resend } from "./resend";
import type { ReactElement } from "react";

export type ApiError = {
  error: string;
  details?: string;
  description?: string;
};

export type ApiResponse<T = unknown> = {
  message?: string;
  data?: T;
};

export type EmailTemplate = {
  from: string;
  to: string;
  subject: string;
  react: ReactElement;
};

export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[],
): boolean {
  if (!allowedMethods.includes(req.method || "")) {
    res.setHeader("Allow", allowedMethods);
    res.status(405).json({ error: "Method Not Allowed" });
    return false;
  }
  return true;
}

export function handleApiError(
  res: NextApiResponse,
  error: unknown,
  customMessage = "An unexpected error occurred",
): void {
  res.status(500).json({
    error: customMessage,
    details: error instanceof Error ? error.message : String(error),
  });
}

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    await resend.emails.send(template);
    return true;
  } catch {
    // Silent fail as email sending is not critical
    return false;
  }
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[],
): string | null {
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }
  return null;
}