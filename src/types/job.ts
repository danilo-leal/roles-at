export type Job = {
  id: string;
  company: string;
  company_slug: string;
  avatar_img: string;
  location: string;
  title: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  is_approved?: boolean;
  is_rejected?: boolean;
  application_link: string;
  notification_email?: string;
};
