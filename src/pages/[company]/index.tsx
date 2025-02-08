import { GetStaticProps, GetStaticPaths } from "next";
import { createClient } from "@supabase/supabase-js";
import { Job } from "@/types/job";
import { PageContainer } from "@/components/primitives/Container";
import { SectionDivider } from "@/components/primitives/Divider";
import { RoleEntry } from "@/components/RoleEntry";
import { Link } from "@/components/primitives/Link";
import { motion } from "motion/react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { company } = context.params as { company: string };

    if (!company) {
      return { notFound: true };
    }

    const { data, error } = await supabase
      .from("job-postings")
      .select("*")
      .eq("company_slug", company)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return { notFound: true };
    }

    if (!data || data.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        jobs: data,
        company: data[0].company,
        companySite: data[0].company_site || null,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: companies, error } = await supabase
    .from("job-postings")
    .select("company_slug")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching companies for static paths:", error);
    return { paths: [], fallback: "blocking" };
  }

  const paths =
    companies?.map((company: { company_slug: string }) => ({
      params: { company: company.company_slug },
    })) || [];

  return {
    paths,
    fallback: "blocking",
  };
};

export default function CompanyPage({
  jobs,
  company,
  companySite,
}: {
  jobs: Job[];
  company: string;
  companySite: string | null;
}) {
  return (
    <PageContainer title={`Jobs at ${company}`}>
      <SectionDivider type="alternative" />
      <hgroup className="w-full flex flex-col gap-1 mb-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-500">Roles at:</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-xl font-semibold">{company}</h1>
          {companySite && (
            <Link href={companySite} external className="text-sm">
              View Company Site
            </Link>
          )}
        </div>
      </hgroup>
      <motion.div
        key="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-1 border-b last:border-0 default-border-color"
          >
            <RoleEntry job={job} />
          </div>
        ))}
      </motion.div>
    </PageContainer>
  );
}
