import { useState } from "react";
import { ContainerTransition } from "@/components/primitives/Container";
import { Navbar } from "@/components/primitives/Navbar";
import { Button } from "@/components/primitives/Button";
import { Field, Label } from "@/components/primitives/Fieldset";
import { Input } from "@/components/primitives/Input";
import { Textarea } from "@/components/primitives/Textarea";

function MigrateJobForm() {
  const [url, setUrl] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, notification_email: notificationEmail }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (response.ok) {
        setMessage("Job posting migrated successfully!");
        setUrl("");
        setNotificationEmail("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: unknown) {
      setMessage(
        `An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`,
      );
      console.error("Error in job migration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field>
        <Label htmlFor="url">Job Posting URL</Label>
        <Input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://example.com/job-posting"
        />
      </Field>
      <Field>
        <Label htmlFor="notificationEmail">Notification Email</Label>
        <Input
          type="email"
          id="notificationEmail"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          required
          placeholder="your@email.com"
        />
      </Field>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Migrating..." : "Migrate Job Posting"}
      </Button>
      {message && <p className="mt-2 text-sm text-zinc-600">{message}</p>}
    </form>
  );
}

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
    <ContainerTransition>
      <Navbar />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Migrate Job Posting</h2>
        <MigrateJobForm />
      </section>
      <h1 className="text-2xl font-bold mb-4">Submit a Job Opening</h1>
      {message && <p className="mb-4 text-sm text-zinc-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label>Company</Label>
            <Input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Label>Job Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label>Location</Label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Field>
          <Field>
            <Label>Company Avatar URL</Label>
            <Input
              type="text"
              value={avatarImg}
              onChange={(e) => setAvatarImg(e.target.value)}
            />
          </Field>
        </div>
        <Field>
          <Label>Application Link</Label>
          <Input
            type="text"
            value={applicationLink}
            onChange={(e) => setApplicationLink(e.target.value)}
            placeholder="URL or instructions to apply"
          />
        </Field>
        <Field>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={4}
          />
        </Field>
        <Field>
          <Label>Salary Range</Label>
          <Input
            type="text"
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
          />
        </Field>
        <Field>
          <Label>Notification Email</Label>
          <Input
            type="email"
            value={notificationEmail}
            onChange={(e) => setNotificationEmail(e.target.value)}
            required
          />
        </Field>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Job Posting"}
        </Button>
      </form>
    </ContainerTransition>
  );
}
