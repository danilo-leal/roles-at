import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    fetchSubmissions();
  }, []);

  const handleApprove = async (submission: Submission) => {
    const response = await fetch("/api/jobs/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });

    if (response.ok) {
      // Refresh submissions
      fetchSubmissions();
    } else {
      const error = await response.json();
      console.error("Error approving submission:", error);
      alert("Failed to approve submission. Please try again.");
    }
  };

  const handleReject = async (submissionId: string) => {
    const response = await fetch("/api/jobs/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: submissionId }),
    });

    if (response.ok) {
      // Refresh submissions
      fetchSubmissions();
    } else {
      const error = await response.json();
      console.error("Error rejecting submission:", error);
      alert("Failed to reject submission. Please try again.");
    }
  };

  const authenticate = () => {
    if (adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAuthenticated(true);
      console.log("Authentication successful"); // Debug log
    } else {
      alert("Invalid admin secret");
      console.log("Authentication failed"); // Debug log
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin secret"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
          className="w-full border p-2 mb-4"
        />
        <button
          onClick={authenticate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
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
