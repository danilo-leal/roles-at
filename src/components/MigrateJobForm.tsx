import React, { useState } from "react";

const MigrateJobForm: React.FC = () => {
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

      const data = await response.json();

      if (response.ok) {
        setMessage("Job posting migrated successfully!");
        setUrl("");
        setNotificationEmail("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: unknown) {
      setMessage("An unexpected error occurred. Please try again.");
      console.error("Error in job migration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700"
        >
          Job Posting URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="https://example.com/job-posting"
        />
      </div>
      <div>
        <label
          htmlFor="notificationEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Notification Email
        </label>
        <input
          type="email"
          id="notificationEmail"
          value={notificationEmail}
          onChange={(e) => setNotificationEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="your@email.com"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? "Migrating..." : "Migrate Job Posting"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </form>
  );
};

export default MigrateJobForm;
