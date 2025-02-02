import { GetStaticProps, GetStaticPaths } from "next";
import { createClient } from "@supabase/supabase-js";
import { Job } from "@/types/job";
import { PageContainer } from "@/components/primitives/Container";
import { SectionDivider } from "@/components/primitives/Divider";
import { RoleEntry } from "@/components/RoleEntry";
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
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default function CompanyPage({
  jobs,
  company,
}: {
  jobs: Job[];
  company: string;
}) {
  return (
    <PageContainer title={`Jobs at ${company}`}>
      <SectionDivider type="alternative" />
      <hgroup className="w-full flex flex-col gap-1 mb-3">
        <p className="text-sm text-zinc-700 dark:text-zinc-500">Roles at:</p>
        <h1 className="text-xl font-semibold">{company}</h1>
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
