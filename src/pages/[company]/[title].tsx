import React, { useState } from "react";
import clsx from "clsx";
import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import {
  DialogBackdrop,
  DialogWrap,
  DialogDescription,
} from "@/components/primitives/Dialog";
import { Job } from "@/types/job";
import { Button } from "@/components/primitives/Button";
import { Link } from "@/components/primitives/Link";
import { PageContainer } from "@/components/primitives/Container";
import { SectionDivider } from "@/components/primitives/Divider";
import { formatDate } from "@/utils/date";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import * as cheerio from "cheerio";
import {
  MapPin,
  Clock,
  Calendar,
  Copy,
  CornerDownRight,
  Check,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const { company, title } = context.params as {
      title: string;
      company: string;
    };

    if (!company) {
      return { notFound: true };
    }

    const { data, error } = await supabase
      .from("job-postings")
      .select("*")
      .eq("company_slug", company)
      .eq("title_slug", title)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Supabase error:", error);
      return { notFound: true };
    }

    if (!data || data.length === 0) {
      return { notFound: true };
    }

    return {
      props: {
        job: data[0],
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all roles
  const { data: jobs, error } = await supabase
    .from("job-postings")
    .select("company_slug, title_slug")
    .order("created_at", { ascending: false })
    .limit(100); // Most recent 100 roles

  if (error) {
    console.error("Error fetching jobs for static paths:", error);
    return { paths: [], fallback: "blocking" };
  }

  const paths = jobs.map((job) => ({
    params: { company: job.company_slug, title: job.title_slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

function Dialog({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      },
    );
  };

  return (
    <BaseDialog.Root dismissible>
      <BaseDialog.Trigger
        render={
          <Button variant="primary" className="flex w-full sm:w-fit ml-auto">
            Apply For Role
          </Button>
        }
      />
      <BaseDialog.Portal>
        <DialogBackdrop />
        <DialogWrap title="Apply via email">
          <DialogDescription>
            Copy the email to send your application. Good luck!
          </DialogDescription>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyEmail}
          >
            {email}
            <span className="relative flex items-center">
              <Copy
                size={14}
                className={clsx(
                  "absolute transition-opacity duration-300",
                  copied ? "opacity-0" : "opacity-50",
                )}
              />
              <Check
                size={14}
                className={clsx(
                  "absolute transition-opacity duration-300 text-green-600 dark:text-green-300",
                  copied ? "opacity-100" : "opacity-0",
                )}
              />
            </span>
          </Button>
        </DialogWrap>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

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
      <h1 className="text-2xl dark:text-white font-semibold my-4" {...props} />
    ),
    h2: (props) => (
      <h2
        className="text-xl dark:text-white font-semibold mt-8 mb-2"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="text-[1.125rem] dark:text-white font-semibold mt-6 mb-2"
        {...props}
      />
    ),
    h5: (props) => (
      <h3 className="text-sm dark:text-zinc-400 my-3" {...props} />
    ),
    p: (props) => <p className="default-p-color my-2 leading-7" {...props} />,
    strong: (props) => (
      <strong className="font-semibold text-black dark:text-white" {...props} />
    ),
    a: (props) => <Link {...props} />,
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

    // No <p> tags inside <li> tags
    $("li p").each((_, elem) => {
      const $elem = $(elem);
      $elem.replaceWith($elem.html() || "");
    });

    // No empty paragraphs
    $("p:empty").remove();

    // No lingering <br/>
    $("br:empty").remove();

    // Remove specific classes
    $(".unwanted-class").removeClass("unwanted-class");

    // Convert <b> tags to <strong>
    $("b").each((_, elem) => {
      const $elem = $(elem);
      $elem.replaceWith(`<strong>${$elem.html() || ""}</strong>`);
    });

    // Clean up heading tags
    $("h1, h2, h3, h4, h5, h6").each((_, elem) => {
      const $elem = $(elem);

      // No <br> tags
      $elem.find("br").remove();

      // Unwrap <strong> tags
      $elem.find("strong").each((_, strongElem) => {
        const $strongElem = $(strongElem);
        $strongElem.replaceWith($strongElem.html() || "");
      });

      // Trim whitespace
      $elem.html($elem.html()?.trim() || "");
    });

    // Trim whitespace
    // $elem.html($elem.html()?.trim() || "");

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
    <PageContainer title={`${job.title} at ${job.company}`}>
      <SectionDivider type="alternative" />
      <div className="pb-6 mb-6 border-b default-border-color">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
          {job.avatar_img && (
            <Image
              src={job.avatar_img}
              alt={`${job.company} logo`}
              width={52}
              height={52}
              className="rounded-full grow-0 shrink-0 object-cover border default-border-color"
            />
          )}
          <div>
            <h1 className="text-xl font-semibold capitalize">{job.title}</h1>
            <p className="default-p-color">{job.company}</p>
          </div>
          {job.application_link ? (
            <Button
              href={job.application_link}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="flex w-full sm:w-fit ml-auto"
            >
              Apply For Role
            </Button>
          ) : (
            <Dialog email={job.notification_email || ""} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          {job.location && (
            <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 text-zinc-600 dark:text-zinc-400">
              <MapPin size={12} className="shrink-0" />
              {job.location}
            </p>
          )}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1">
              <Clock size={12} className="shrink-0" />
              {formatDate(job.created_at)}
            </p>
            <hr className="mx-1 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
            <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1">
              <Calendar size={12} className="shrink-0" />
              {new Date(job.created_at).toLocaleDateString()}
            </p>
            {job.salary_range && (
              <>
                <hr className="mx-1 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
                <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1">
                  {job.salary_range}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mb-8">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
          {sanitizeAndCleanHtml(job.description)}
        </ReactMarkdown>
      </div>
      <div className="pt-8 flex items-center gap-2 default-p-style border-t default-border-color">
        <CornerDownRight size={14} />
        <span>
          You may also want to check out other{" "}
          <Link href={`/${job.company_slug}`}>
            avaialble roles at {job.company}.
          </Link>
        </span>
      </div>
    </PageContainer>
  );
}
