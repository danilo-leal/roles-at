import { useEffect, useState, useCallback } from "react";
// import Image from "next/image";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import MigrateJobForm from "@/components/MigrateJobForm";
import { createSlug } from "@/utils/slugify";

type JobPosting = {
  id: string;
  company: string;
  title: string;
  description: string;
  salary_range: string;
  submitter_email: string;
  created_at: string;
  avatar_img: string;
  location: string;
  is_approved: boolean;
  is_rejected: boolean;
  application_link: string;
};

const AdminPage: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const supabase = useSupabaseClient();

  const fetchJobPostings = useCallback(async () => {
    if (!session) {
      setError("No active session. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("job-postings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setJobPostings(data as JobPosting[]);
      setError(null);
    } catch (error: unknown) {
      console.error("Error fetching job postings:", error);
      setError(
        `Error fetching job postings: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  }, [supabase, session]);

  useEffect(() => {
    if (session) fetchJobPostings();
    else setLoading(false);
  }, [session, fetchJobPostings]);

  const handleApprove = async (jobPosting: JobPosting) => {
    console.log("Approving job posting:", jobPosting.id);
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jobPosting.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve job posting");
      }

      console.log("Job posting approved successfully");
      fetchJobPostings(); // Refresh the list
    } catch (error) {
      console.error("Error approving job posting:", error);
      alert(
        `Failed to approve job posting: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleReject = async (jobPosting: JobPosting) => {
    console.log("Rejecting job posting:", jobPosting.id);
    try {
      const response = await fetch("/api/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: jobPosting.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject job posting");
      }

      console.log("Job posting rejected successfully");
      fetchJobPostings(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting job posting:", error);
      alert(
        `Failed to reject job posting: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(`Login failed: ${error.message}`);
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full border p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div>Loading job postings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const pendingCount = jobPostings.filter(
    (job) => !job.is_approved && !job.is_rejected,
  ).length;
  const approvedCount = jobPostings.filter((job) => job.is_approved).length;
  const rejectedCount = jobPostings.filter((job) => job.is_rejected).length;
  const totalCount = jobPostings.length;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-8">
        <Link href="/submit">Submit a Job</Link>
        <Link href="/">Home</Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Migrate Job Posting</h2>
        <MigrateJobForm />
      </section>

      <h2 className="text-xl font-semibold mb-4">Pending Job Postings</h2>

      <div className="mb-4">
        <p>Total Job Postings: {totalCount}</p>
        <p>Pending: {pendingCount}</p>
        <p>Approved: {approvedCount}</p>
        <p>Rejected: {rejectedCount}</p>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Company</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobPostings.map((jobPosting) => (
            <tr key={jobPosting.id}>
              <td className="border p-2">
                <Link href={`/${createSlug(jobPosting.company)}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {jobPosting.company}
                  </span>
                </Link>
              </td>
              <td className="border p-2">{jobPosting.title}</td>
              <td className="border p-2">
                {new Date(jobPosting.created_at).toLocaleString()}
              </td>
              <td className="border p-2">
                {jobPosting.is_approved
                  ? "Approved"
                  : jobPosting.is_rejected
                    ? "Rejected"
                    : "Pending"}
              </td>
              <td className="border p-2">
                {!jobPosting.is_approved && (
                  <button
                    onClick={() => handleApprove(jobPosting)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                )}
                {!jobPosting.is_rejected && (
                  <button
                    onClick={() => handleReject(jobPosting)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
