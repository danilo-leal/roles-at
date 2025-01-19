import { useEffect, useState } from "react";
import { createSlug } from "@/utils/slugify";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import * as cheerio from "cheerio";

type Job = {
  id: string;
  company: string;
  avatar_img: string;
  location: string;
  title: string;
  description: string;
  salary_range: string;
  is_open: boolean;
  created_at: string;
  is_approved: boolean;
  application_link: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const components: Components = {
    h1: (props) => <h1 className="text-2xl font-bold my-4" {...props} />,
    h2: (props) => <h2 className="text-xl font-semibold my-3" {...props} />,
    p: (props) => <p className="my-2" {...props} />,
    ul: (props) => <ul className="list-disc list-inside my-2" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside my-2" {...props} />,
    li: (props) => <li className="flex" {...props} />,
  };

  const cleanHtml = (html: string) => {
    const $ = cheerio.load(html);

    // Remove <p> tags inside <li> tags
    $("li p").each((_, elem) => {
      const $elem = $(elem);
      $elem.replaceWith($elem.html() || "");
    });

    // Remove empty paragraphs
    $("p:empty").remove();

    // Remove specific classes
    $(".unwanted-class").removeClass("unwanted-class");

    // Convert <b> tags to <strong>
    $("b").each((_, elem) => {
      const $elem = $(elem);
      $elem.replaceWith(`<strong>${$elem.html() || ""}</strong>`);
    });

    // Add more rules as needed

    return $.html();
  };

  const sanitizeAndCleanHtml = (html: string) => {
    if (typeof window === "undefined") {
      // Server-side: just clean the HTML
      return cleanHtml(html);
    }
    // Client-side: clean and sanitize
    return DOMPurify.sanitize(cleanHtml(html));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        // Only show approved jobs
        const approvedJobs = data.filter((job: Job) => job.is_approved);
        setJobs(approvedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 mb-8">
        <Link href="/submit">Submit a Job</Link>
        <Link href="/admin">Admin</Link>
      </div>
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Link href={`/${createSlug(job.company)}`} key={job.id}>
            <div className="border p-4 mb-4 rounded-sm hover:shadow-lg transition-shadow duration-200">
              {job.avatar_img && (
                <Image
                  src={job.avatar_img}
                  unoptimized
                  alt={`${job.company} logo`}
                  width={64}
                  height={64}
                  className="mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">Company: {job.company}</p>
              {job.location && (
                <p className="text-gray-600">Location: {job.location}</p>
              )}
              <p className="text-gray-600">
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </p>
              <div className="mt-2">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={components}
                >
                  {sanitizeAndCleanHtml(job.description)}
                </ReactMarkdown>
              </div>
              <p className="mt-2">Salary: {job.salary_range}</p>
              <p
                className={`mt-2 ${job.is_open ? "text-green-600" : "text-red-600"}`}
              >
                {job.is_open ? "Open" : "Closed"}
              </p>
              {job.application_link && (
                <a
                  href={job.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Apply for this position
                </a>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No approved jobs available</p>
      )}
    </div>
  );
}
