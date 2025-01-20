import { useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Job } from "@/types/job";
import JobsPage from "./index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);
  const { company } = context.params as { company: string };

  const { data: job, error } = await supabase
    .from("job-postings")
    .select("*")
    .eq("company_slug", company)
    .single();

  if (error || !job) {
    return { notFound: true };
  }

  return { props: { initialJob: job } };
};

export default function CompanyPage({ initialJob }: { initialJob: Job }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/?company=${initialJob.company_slug}`, undefined, {
      shallow: true,
    });
  }, [initialJob, router]);

  return <JobsPage initialSelectedJob={initialJob} />;
}
