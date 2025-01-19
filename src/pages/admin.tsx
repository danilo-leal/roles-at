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
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setSubmissions(data as Submission[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (submission: Submission) => {
    // Insert into job_postings
    const { error: insertError } = await supabase.from("job_postings").insert([
      {
        company: submission.company,
        title: submission.title,
        description: submission.description,
        salary_range: submission.salary_range,
      },
    ]);

    if (insertError) {
      console.error(insertError);
      return;
    }

    // Delete from submissions
    const { error: deleteError } = await supabase
      .from("submissions")
      .delete()
      .eq("id", submission.id);

    if (deleteError) {
      console.error(deleteError);
      return;
    }

    // Refresh submissions
    fetchSubmissions();
  };

  const handleReject = async (submissionId: string) => {
    // Delete from submissions
    const { error } = await supabase
      .from("submissions")
      .delete()
      .eq("id", submissionId);

    if (error) {
      console.error(error);
      return;
    }

    // Refresh submissions
    fetchSubmissions();
  };

  const authenticate = () => {
    if (adminSecret === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin secret");
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
