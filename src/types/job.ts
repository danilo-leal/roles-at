export type Job = {
  id: string;
  company: string;
  company_slug: string;
  company_site: string;
  avatar_img: string;
  location: string;
  title: string;
  title_slug?: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  is_approved?: boolean;
  is_rejected?: boolean;
  application_link: string;
  notification_email?: string;
};
