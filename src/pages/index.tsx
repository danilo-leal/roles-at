import { useEffect, useState } from "react";
import { createSlug } from "@/utils/slugify";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/primitives/Navbar";
import { Container } from "@/components/primitives/Container";
import { formatDate } from "@/utils/data";

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
  is_approved: boolean;
  application_link: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        // Only show approved jobs
        const approvedJobs = data.filter((job: Job) => job.is_approved);
        setJobs(approvedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Container>
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      <div className="flex flex-col gap-5">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Link href={`/${createSlug(job.company)}`} key={job.id}>
              <div className="border default-border-color rounded-sm">
                <div className="p-4 flex items-center gap-4">
                  {job.avatar_img && (
                    <Image
                      src={job.avatar_img}
                      alt={`${job.company} logo`}
                      width={44}
                      height={44}
                      className="rounded-full shrink-0"
                    />
                  )}
                  <div className="w-full flex flex-col">
                    <div className="w-full flex justify-between">
                      <h2 className="">{job.company}</h2>
                      <p
                        className={clsx(
                          job.is_open ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {job.is_open ? "Open" : "Closed"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{job.title}</p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t default-border-color flex">
                  {job.location && (
                    <p className="text-gray-600">Location: {job.location}</p>
                  )}
                  <p className="text-gray-600">{formatDate(job.created_at)}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No approved jobs available</p>
        )}
      </div>
    </Container>
  );
}
