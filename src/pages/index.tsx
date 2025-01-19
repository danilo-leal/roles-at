import { useEffect, useState } from "react";
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
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("/api/");
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-8">
        <Link href="/submit">Submit a Job</Link>
        <Link href="/admin">Admin</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {Array.isArray(jobs) && jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="border p-4 mb-4 rounded">
            {job.avatar_img && (
              <Image
                // src={`https://res.cloudinary.com/read-cv/image/upload/c_fill,h_92,w_92/dpr_2.0/v1/1/profilePhotos/${job.avatar_img}`}
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
            <p className="mt-2">{job.description}</p>
            <p className="mt-2">Salary: {job.salary_range}</p>
            <p
              className={`mt-2 ${job.is_open ? "text-green-600" : "text-red-600"}`}
            >
              {job.is_open ? "Open" : "Closed"}
            </p>
          </div>
        ))
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
}
