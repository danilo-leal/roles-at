import { GetServerSideProps } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { createSlug } from "@/utils/slugify";

type Job = {
  id: string;
  company: string;
  avatar_img: string;
  location: string;
  title: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  application_link: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createPagesServerClient(context);
  const { company } = context.params as { company: string };

  console.log("Requested company slug:", company);

  const { data: jobs, error } = await supabase.from("job-postings").select("*");

  if (error) {
    console.error("Error fetching jobs:", error);
    return { notFound: true };
  }

  const job = jobs.find((j) => createSlug(j.company) === company);

  console.log("Matched job:", job);

  if (!job) {
    return { notFound: true };
  }

  return {
    props: {
      job,
    },
  };
};

const JobPage: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="border p-4 mb-4 rounded">
        {job.avatar_img && (
          <Image
            src={job.avatar_img}
            unoptimized
            alt={`${job.company} logo`}
            width={64}
            height={64}
            className="mb-2"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <h2 className="text-xl mb-2">{job.company}</h2>
        {job.location && (
          <p className="text-gray-600 mb-2">Location: {job.location}</p>
        )}
        <p className="text-gray-600 mb-2">
          Posted on: {new Date(job.created_at).toLocaleDateString()}
        </p>
        <p className="mt-4">{job.description}</p>
        <p className="mt-2">Salary: {job.salary_range}</p>
        <p
          className={`mt-2 ${job.is_open ? "text-green-600" : "text-red-600"}`}
        >
          {job.is_open ? "Open" : "Closed"}
        </p>
        {job.application_link && (
          <a
            href={job.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply for this position
          </a>
        )}
      </div>
    </div>
  );
};

export default JobPage;
