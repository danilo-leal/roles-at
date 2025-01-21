import { GetServerSideProps } from "next";
import Image from "next/image";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Job } from "@/types/job";
import { Navbar } from "@/components/primitives/Navbar";
import { ContainerTransition } from "@/components/primitives/Container";
import { SectionDivider } from "@/components/primitives/Divider";
// import { formatDate } from "@/utils/date";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import * as cheerio from "cheerio";
// import { MapPin, Clock, Calendar } from "@phosphor-icons/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const supabase = createPagesServerClient(context);

    if (!supabase) {
      throw new Error("Failed to initialize Supabase client");
    }

    const { company } = context.params as { company: string };

    if (!company) {
      return { notFound: true };
    }

    const { data, error } = await supabase
      .from("job-postings")
      .select("*")
      .eq("company_slug", company)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        job: JSON.parse(JSON.stringify(data[0])), // Ensure serializable
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
    };
  }
};

export default function CompanyPage({
  job,
  error,
}: {
  job?: Job;
  error?: string;
}) {
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  const components: Components = {
    h1: (props) => (
      <h1 className="text-2xl dark:text-white font-bold my-4" {...props} />
    ),
    h2: (props) => (
      <h2
        className="pt-6 text-xl dark:text-white font-semibold my-3"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="pt-4 text-xl dark:text-white font-semibold my-3"
        {...props}
      />
    ),
    p: (props) => <p className="default-p-color my-2 leading-7" {...props} />,
    ul: (props) => (
      <ul
        className="list-disc pl-6 default-p-color flex flex-col gap-0.5 leading-7"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal pl-6 default-p-color flex flex-col gap-0.5 leading-7"
        {...props}
      />
    ),
    li: (props) => <li className="" {...props} />,
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

  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider type="alternative" />
      <div className="pb-6 mb-6 border-b default-border-color">
        <div className="flex items-center gap-6 mb-6">
          {job.avatar_img && (
            <Image
              src={job.avatar_img}
              alt={`${job.company} logo`}
              width={52}
              height={52}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold">{job.title}</h1>
            <p className="default-p-color">{job.company}</p>
          </div>
          {/* {job.application_link ? (
            <Button
              href={job.application_link}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="hidden sm:flex ml-auto"
            >
              Apply for this position
            </Button>
          ) : (
            <div className="hidden sm:flex ml-auto">
              <Dialog email={job.notification_email || ""} />
            </div>
          )} */}
        </div>
        {/* <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {job.location && (
            <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
              <MapPin size={12} />
              {job.location}
            </p>
          )}
          <hr className="mx-1 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
          <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
            <Clock size={12} />
            {formatDate(job.created_at)}
          </p>
          <hr className="mx-1 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
          <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
            <Calendar size={12} />
            {new Date(job.created_at).toLocaleDateString()}
          </p>
          <hr className="mx-1 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
          {job.salary_range && (
            <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
              {job.salary_range}
            </p>
          )}
        </div> */}
      </div>
      <div className="mb-8">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
          {sanitizeAndCleanHtml(job.description)}
        </ReactMarkdown>
      </div>
    </ContainerTransition>
  );
}
