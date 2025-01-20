import { useState } from "react";
import MigrateJobForm from "@/components/MigrateJobForm";
import { Navbar } from "@/components/primitives/Navbar";
import { Container } from "@/components/primitives/Container";

export default function SubmitPage() {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [location, setLocation] = useState("");
  const [avatarImg, setAvatarImg] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
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
          location,
          avatar_img: avatarImg,
          application_link: applicationLink,
          notification_email: notificationEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessage(
        data.message ||
          "Your submission has been received and is pending approval.",
      );
      // Clear form
      setCompany("");
      setTitle("");
      setDescription("");
      setSalaryRange("");
      setLocation("");
      setAvatarImg("");
      setApplicationLink("");
      setNotificationEmail("");
    } catch (error) {
      console.error("Error submitting job posting:", error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Navbar />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Migrate Job Posting</h2>
        <MigrateJobForm />
      </section>
      <h1 className="text-2xl font-bold mb-4">Submit a Job Opening</h1>
      {message && <p className="mb-4 text-sm text-zinc-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Company:
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Job Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Location:
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Company Avatar URL:
          </label>
          <input
            type="text"
            value={avatarImg}
            onChange={(e) => setAvatarImg(e.target.value)}
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Application Link:
          </label>
          <input
            type="text"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="URL or instructions to apply"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Salary Range:
          </label>
          <input
            type="text"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Notification Email:
          </label>
          <input
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? "Submitting..." : "Submit Job Posting"}
        </button>
      </form>
    </Container>
  );
}
