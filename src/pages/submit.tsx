import { useState } from "react";
import MigrateJobForm from "@/components/MigrateJobForm";
import Link from "next/link";

export default function SubmitPage() {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [applicationLink, setApplicationLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company,
        title,
        description,
        salary_range: salaryRange,
        submitter_email: email,
        location,
        avatar_img: avatarImg,
        application_link: applicationLink,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Your submission has been received and is pending approval.");
      // Clear form
      setCompany("");
      setTitle("");
      setDescription("");
      setSalaryRange("");
      setEmail("");
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-8">
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </div>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Migrate Job Posting</h2>
        <MigrateJobForm />
      </section>

      <h1 className="text-2xl font-bold mb-4">Submit a Job Opening</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Company:</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Job Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Company Avatar URL:</label>
          <input
            type="text"
            value={avatarImg}
            onChange={(e) => setAvatarImg(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Application Link:</label>
          <input
            type="text"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            className="w-full border p-2"
            placeholder="URL or instructions to apply"
          />
        </div>
        <div>
          <label className="block">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Salary Range:</label>
          <input
            type="text"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className="w-full border p-2"
          />
        </div>
        <div>
          <label className="block">Your Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
