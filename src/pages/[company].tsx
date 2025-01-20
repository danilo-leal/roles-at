import { GetServerSideProps } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createSlug } from "@/utils/slugify";
import { Job } from "@/pages/index";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);
  const { company } = context.params as { company: string };

  const { data: jobs, error } = await supabase.from("job-postings").select("*");

  if (error) {
    console.error("Error fetching jobs:", error);
    return { notFound: true };
  }

  const job = jobs.find((j) => createSlug(j.company) === company);

  if (!job) {
    return { notFound: true };
  }

  return {
    props: {
      job,
    },
  };
};

const CompanyPage: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.history.replaceState({}, '', '/?company=${createSlug(job.company)}');
            window.location.reload();
          `,
        }}
      />
    </div>
  );
};

export default CompanyPage;
