import { useEffect, useState } from "react";
import { createSlug } from "@/utils/slugify";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/primitives/Navbar";
import { Chip } from "@/components/primitives/Chip";
import { Container } from "@/components/primitives/Container";
import { formatDate } from "@/utils/data";
import { Smiley, Heart } from "@phosphor-icons/react";

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
      {/* <h1 className="text-2xl font-bold mb-4">Job Listings</h1> */}
      <div className="py-8 flex flex-col gap-4">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Link
              href={`/${createSlug(job.company)}`}
              key={job.id}
              className={clsx(
                "border default-border-color rounded-sm p-4 flex items-center gap-4",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
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
                <div className="w-full flex items-center justify-between">
                  <h2 className="">{job.company}</h2>
                  <Chip color={job.is_open ? "green" : "red"} size="small">
                    {job.is_open ? "Open" : "Closed"}
                  </Chip>
                </div>
                <div className="w-full flex justify-between">
                  <p className="text-sm">{job.title}</p>
                  <div className="flex gap-2">
                    {job.location && (
                      <p className="flex items-center gap-1 text-sm">
                        <Smiley />
                        {job.location}
                      </p>
                    )}
                    <hr className="w-px h-full bg-gray-300" />
                    <p className="flex items-center gap-1 text-sm">
                      <Heart />
                      {formatDate(job.created_at)}
                    </p>
                  </div>
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
