import React from "react";
import Image from "next/image";
import { Dialog } from "@base-ui-components/react/dialog";
import { useRouter } from "next/router";
import { Job } from "@/types/job";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import DOMPurify from "isomorphic-dompurify";
import * as cheerio from "cheerio";
import clsx from "clsx";
import { Chip } from "@/components/primitives/Chip";
import { Button } from "@/components/primitives/Button";
import { formatDate } from "@/utils/date";
import { MapPin, Clock } from "@phosphor-icons/react";

type JobDetailsDialogProps = {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
};

export function JobDetailsDialog({
  job,
  isOpen,
  onClose,
}: JobDetailsDialogProps) {
  const router = useRouter();

  const components: Components = {
    h1: (props) => <h1 className="text-2xl font-bold my-4" {...props} />,
    h2: (props) => <h2 className="text-xl font-semibold my-3" {...props} />,
    p: (props) => <p className="my-2" {...props} />,
    ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: (props) => <ol className="list-decimal my-2" {...props} />,
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

  const handleClose = () => {
    router.push("/", undefined, { shallow: true });
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={clsx(
            "fixed inset-0 bg-black/20 dark:bg-zinc-900/10 transition-all duration-150",
            "backdrop-blur-xs",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
          )}
        />
        <Dialog.Popup
          className={clsx(
            "fixed bottom-0 sm:top-1/2 left-1/2 -mt-8",
            "-translate-x-1/2 sm:-translate-y-1/2 rounded-b-none sm:rounded-b-lg rounded-t-lg",
            "w-full sm:w-[700px] max-h-[80vh] sm:max-h-[700px] overflow-clip",
            "bg-gray-50 text-gray-900",
            "dark:bg-neutral-950 text-gray-900",
            "border default-border-color",
            "outline-none shadow-2xl",
            "transition-all duration-150",
            "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
            "data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
          )}
        >
          <div className="grow flex flex-col size-full overflow-y-auto">
            <Dialog.Title className="-mt-1.5 px-5 pt-5 pb-4 text-lg dark:text-white font-medium border-b default-border-color">
              Job Opening
            </Dialog.Title>
            <Dialog.Description className="relative size-full p-5 overflow-y-auto">
              <div
                className={clsx(
                  "group rounded-lg flex items-center gap-4",
                  "pb-4 mb-6 border-b default-border-color",
                )}
              >
                {job.avatar_img && (
                  <Image
                    src={job.avatar_img}
                    alt={`${job.company} logo`}
                    width={44}
                    height={44}
                    className="rounded-full size-10 grow-0 shrink-0 object-cover"
                  />
                )}
                <div className="w-full flex flex-col">
                  <div className="w-full flex items-center justify-between">
                    <h2 className="dark:text-white font-medium">
                      {job.company}
                    </h2>
                    <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
                      <Clock size={10} />
                      {formatDate(job.created_at)}
                      <hr className="mx-2 h-4 w-px border-none bg-gray-200 dark:bg-zinc-800" />
                      <span>
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="w-full flex justify-between">
                    <p className="text-sm text-zinc-700 dark:text-zinc-500">
                      {job.title}
                    </p>
                    {job.location && (
                      <Chip color="zinc" className="gap-1">
                        <MapPin />
                        <span className="">{job.location}</span>
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
              <div className="default-p-color">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={components}
                >
                  {sanitizeAndCleanHtml(job.description)}
                </ReactMarkdown>
              </div>
            </Dialog.Description>
            {job.application_link && (
              <div className="dark:bg-neutral-950 w-full border-t default-border-color flex p-4 sm:justify-end default-p-color">
                <Button
                  href={job.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  className="w-full sm:w-fit"
                >
                  Apply for this position
                </Button>
              </div>
            )}
          </div>
          {/* <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close> */}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
