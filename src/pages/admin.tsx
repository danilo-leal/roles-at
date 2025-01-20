import { useEffect, useState, useCallback } from "react";
import { Job } from "@/types/job";
import Link from "next/link";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Navbar } from "@/components/primitives/Navbar";
import { SectionDivider } from "@/components/primitives/Divider";
import { ContainerTransition } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { createSlug } from "@/utils/slugify";

export default function AdminPage() {
  const [jobPostings, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  const supabase = useSupabaseClient();

  const fetchJobs = useCallback(async () => {
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

      setJobs(data as Job[]);
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
    if (session) fetchJobs();
    else setLoading(false);
  }, [session, fetchJobs]);

  const handleApprove = async (jobPosting: Job) => {
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
      fetchJobs(); // Refresh the list
    } catch (error) {
      console.error("Error approving job posting:", error);
      alert(
        `Failed to approve job posting: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const handleReject = async (jobPosting: Job) => {
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
      fetchJobs(); // Refresh the list
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
            className="w-full border default-border-color p-2"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border default-border-color p-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-sm"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  const pendingCount = jobPostings.filter(
    (job) => !job.is_approved && !job.is_rejected,
  ).length;
  const approvedCount = jobPostings.filter((job) => job.is_approved).length;
  const rejectedCount = jobPostings.filter((job) => job.is_rejected).length;
  const totalCount = jobPostings.length;

  const renderLoading = () => (
    <div className="py-2 flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-[78px] w-full" />
      ))}
    </div>
  );

  const renderContent = () => (
    <>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="border default-border-color p-4 mb-6 grid grid-cols-4 gap-4">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-gray-500">
            Total Job Postings
          </p>
          <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-yellow-600">Pending</p>
          <p className="text-2xl font-semibold text-yellow-700">
            {pendingCount}
          </p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-green-600">Approved</p>
          <p className="text-2xl font-semibold text-green-700">
            {approvedCount}
          </p>
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-medium text-red-600">Rejected</p>
          <p className="text-2xl font-semibold text-red-700">{rejectedCount}</p>
        </div>
      </div>
      <table className="w-full border-collapse border default-border-color">
        <thead>
          <tr>
            <th className="border default-border-color p-2">Company</th>
            <th className="border default-border-color p-2">Title</th>
            <th className="border default-border-color p-2">Created At</th>
            <th className="border default-border-color p-2">Status</th>
            <th className="border default-border-color p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobPostings.map((jobPosting) => (
            <tr key={jobPosting.id}>
              <td className="border default-border-color p-2">
                <Link href={`/${createSlug(jobPosting.company)}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {jobPosting.company}
                  </span>
                </Link>
              </td>
              <td className="border default-border-color p-2">
                {jobPosting.title}
              </td>
              <td className="border default-border-color p-2">
                {new Date(jobPosting.created_at).toLocaleString()}
              </td>
              <td className="border default-border-color p-2">
                {jobPosting.is_approved
                  ? "Approved"
                  : jobPosting.is_rejected
                    ? "Rejected"
                    : "Pending"}
              </td>
              <td className="border default-border-color p-2">
                {!jobPosting.is_approved && (
                  <button
                    onClick={() => handleApprove(jobPosting)}
                    className="bg-green-500 text-white px-2 py-1 rounded-sm mr-2"
                  >
                    Approve
                  </button>
                )}
                {!jobPosting.is_rejected && (
                  <button
                    onClick={() => handleReject(jobPosting)}
                    className="bg-red-500 text-white px-2 py-1 rounded-sm"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider />
      {loading ? renderLoading() : renderContent()}
    </ContainerTransition>
  );
}
