import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { resend } from '@/lib/resend';
import { render } from '@react-email';
import ConfirmationEmail from '@/components/ConfirmationEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { company, title, desc, salary_range, submitter_email } = req.body;

    // Validate input
    if (!company || !title || !desc || !submitter_email) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Insert into submissions table
    const { data, error } = await supabase
      .from('submissions')
      .insert([
        {
          company,
          title,
          description: desc,
          salary_range,
          submitter_email,
        },
      ]);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Render the email HTML
    const emailHtml = render(<ConfirmationEmail company={company} title={title} email={submitter_email} />);

    // Send the email using Resend
    try {
      await resend.emails.send({
        from: 'your-email@example.com', // Replace with your verified sender
        to: submitter_email,
        subject: 'Job Submission Received',
        html: emailHtml,
      });
    } catch (emailError: any) {
      console.error('Error sending email:', emailError);
      // You might choose to notify the user even if email fails
    }

    res.status(201).json({ message: 'Submission received', data });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
