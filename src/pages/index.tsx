import { useEffect, useState } from "react";
// import { supabase } from "@/pages/lib/supabaseClient";

type Job = {
  id: string;
  company: string;
  title: string;
  desc: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("/api/jobs");
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
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {Array.isArray(jobs) && jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">Company: {job.company}</p>
            <p className="text-gray-600">
              Posted on: {new Date(job.created_at).toLocaleDateString()}
            </p>
            <p className="mt-2">{job.desc}</p>
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
