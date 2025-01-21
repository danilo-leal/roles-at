import { GetServerSideProps } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Job } from "@/types/job";
import { Navbar } from "@/components/primitives/Navbar";
import { ContainerTransition } from "@/components/primitives/Container";
import { SectionDivider } from "@/components/primitives/Divider";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const supabase = createPagesServerClient(context);

    if (!supabase) {
      throw new Error("Failed to initialize Supabase client");
    }

    const { company } = context.params as { company: string };

    if (!company) {
      return { notFound: true };
    }

    const { data, error } = await supabase
      .from("job-postings")
      .select("*")
      .eq("company_slug", company)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        job: JSON.parse(JSON.stringify(data[0])), // Ensure serializable
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
};

export default function CompanyPage({
  job,
  error,
}: {
  job?: Job;
  error?: string;
}) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <ContainerTransition>
      {/* <Navbar /> */}
      <SectionDivider type="alternative" />
      <h1>{job.title}</h1>
      <p>Company: {job.company}</p>
      <p>Location: {job.location}</p>
      <p>Salary Range: {job.salary_range}</p>
      <p>Description: {job.description}</p>
    </ContainerTransition>
  );
}
