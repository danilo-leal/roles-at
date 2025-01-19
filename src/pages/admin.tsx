import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

type Submission = {
  id: string;
  company: string;
  title: string;
  description: string;
  salary_range: string;
  submitter_email: string;
  submitted_at: string;
};

const AdminPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const supabase = useSupabaseClient();

  const fetchSubmissions = async () => {
    console.log("Fetching submissions..."); // Debug log
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Error fetching submissions:", error);
      return;
    }

    console.log("Fetched submissions:", data); // Debug log
    setSubmissions(data as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchSubmissions();
    }
  }, [session]);

  const handleApprove = async (submission: Submission) => {
    try {
      console.log("Sending approval request for submission:", submission);
      const response = await fetch("/api/jobs/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseData = await response.json();
      console.log("Full response:", responseData);

      if (response.ok) {
        console.log("Approval successful");
        fetchSubmissions();
      } else {
        console.error("Error approving submission:", responseData);
        alert(
          `Failed to approve submission: ${responseData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleReject = async (submissionId: string) => {
    try {
      const response = await fetch("/api/jobs/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: submissionId }),
        credentials: "include",
      });

      if (response.ok) {
        fetchSubmissions();
      } else {
        const errorData = await response.json();
        console.error("Error rejecting submission:", errorData);
        alert(`Failed to reject submission: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      alert(error.message);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
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
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Job Submissions</h1>
      {submissions.length === 0 ? (
        <p>No submissions pending.</p>
      ) : (
        submissions.map((submission) => (
          <div key={submission.id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-semibold">{submission.title}</h2>
            <p className="text-gray-600">Company: {submission.company}</p>
            <p className="text-gray-600">
              Submitted on:{" "}
              {new Date(submission.submitted_at).toLocaleDateString()}
            </p>
            <p className="mt-2">{submission.description}</p>
            <p className="mt-2">Salary: {submission.salary_range}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleApprove(submission)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(submission.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPage;
