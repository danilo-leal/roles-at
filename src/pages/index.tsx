import { useEffect, useState } from "react";
import { createSlug } from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";

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
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-8">
        <Link href="/submit">Submit a Job</Link>
        <Link href="/admin">Admin</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Link href={`/${createSlug(job.company)}`} key={job.id}>
            <div className="border p-4 mb-4 rounded hover:shadow-lg transition-shadow duration-200">
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
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">Company: {job.company}</p>
              {job.location && (
                <p className="text-gray-600">Location: {job.location}</p>
              )}
              <p className="text-gray-600">
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </p>
              <p className="mt-2 truncate">{job.description}</p>
              <p className="mt-2">Salary: {job.salary_range}</p>
              <p
                className={`mt-2 ${job.is_open ? "text-green-600" : "text-red-600"}`}
              >
                {job.is_open ? "Open" : "Closed"}
              </p>
            </div>
          </Link>
        ))
      ) : (
        <p>No approved jobs available</p>
      )}
    </div>
  );
}
