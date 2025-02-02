import * as React from "react";
import { Job } from "@/types/job";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { formatDate } from "@/utils/date";
import { MapPin, Clock } from "lucide-react";

export function RoleEntry({ job }: { job: Job }) {
  return (
    <Link
      href={`/${job.company_slug}/${job.title_slug}`}
      className={clsx(
        "group cursor-pointer rounded-xl",
        "-mx-5 px-4 py-3",
        "flex items-start sm:items-center gap-4",
        "border border-transparent",
        "hover:border-orange-300 dark:hover:border-orange-300/20",
        "hover:bg-orange-50/50 dark:hover:bg-orange-800/8",
        "transition-colors duration-70 fv-style",
      )}
    >
      {job.avatar_img && (
        <Image
          src={job.avatar_img}
          alt={`${job.company} logo`}
          width={44}
          height={44}
          className="rounded-full mt-1 sm:mt-0 size-8 grow-0 shrink-0 object-cover border default-border-color"
        />
      )}
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center justify-between">
          <h2 className="capitalize font-medium text-[0.9375rem]">
            {job.title}
          </h2>
          <p className="shrink-0 flex items-center gap-2 text-[0.6875rem] font-mono pb-1 dark:text-zinc-500">
            <Clock size={9} className="opacity-80 shrink-0" />
            {formatDate(job.created_at)}
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-sm text-zinc-700 dark:text-zinc-500">
            {job.company}
          </p>
          {job.location && (
            <p className="max-w-[280px] md:max-w-[430px] shrink-0 flex items-center gap-2 pb-1">
              <MapPin size={9} className="opacity-80 shrink-0" />
              <span className="truncate text-[0.6875rem] font-mono dark:text-zinc-500">
                {job.location}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
