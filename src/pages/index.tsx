import * as React from "react";
import { Job } from "@/types/job";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { Navbar } from "@/components/primitives/Navbar";
import { ContainerTransition } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { SectionDivider } from "@/components/primitives/Divider";
import { Input, InputGroup } from "@/components/primitives/Input";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Kbd } from "@/components/primitives/Keybinding";
import { formatDate } from "@/utils/date";
import { MapPin, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EmptyBox } from "@/components/primitives/Illustrations";

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = React.useState<Job[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }
        const data = await response.json();
        const approvedJobs = data.filter((job: Job) => job.is_approved);
        setJobs(approvedJobs);
        setFilteredJobs(approvedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(
          `Failed to fetch jobs: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  React.useEffect(() => {
    const filtered = jobs.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "i") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const renderLoading = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-2 flex flex-col gap-2"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-[78px] w-full" />
      ))}
    </motion.div>
  );

  const renderContent = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-2 size-full flex flex-col"
    >
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-1 border-b last:border-0 default-border-color"
          >
            <Link
              href={job.company_slug}
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
                  <p className="shrink-0 flex items-center gap-1 text-[0.6875rem] font-mono pb-1 dark:text-zinc-500">
                    <Clock size={9} className="opacity-80" />
                    {formatDate(job.created_at)}
                  </p>
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-sm text-zinc-700 dark:text-zinc-500">
                    {job.company}
                  </p>
                  {job.location && (
                    <p className="shrink-0 flex items-center gap-1 text-[0.6875rem] font-mono pb-1 dark:text-zinc-500">
                      <MapPin size={9} className="opacity-80" />
                      {job.location}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
        <div className="py-16 size-full flex flex-col items-center gap-4">
          <EmptyBox className="size-56 opacity-60" />
          <span className="text-xs default-p-color font-mono">
            No matching jobs found
          </span>
        </div>
      )}
    </motion.div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ContainerTransition>
      <Navbar />
      <SectionDivider />
      <hgroup className="w-full flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Find Your Next Role</h1>
        <div className="flex items-center gap-2">
          <p className="hidden sm:inline text-xs font-mono dark:text-zinc-500">
            {filteredJobs.length} Open Roles
          </p>
          <p className="inline sm:hidden text-xs font-mono dark:text-zinc-500">
            {filteredJobs.length} Open
          </p>
          <SubscribeForm />
        </div>
      </hgroup>
      <InputGroup data-slot="search">
        <Search data-slot="icon" />
        <Input
          ref={searchInputRef}
          startSlot
          keybinding
          type="search"
          aria-label="Search"
          placeholder="Roles, location, or companies…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="hidden absolute inset-y-0 right-4 sm:flex items-center gap-1">
          <Kbd char="⌘" />
          <Kbd char="I" />
        </span>
      </InputGroup>
      <AnimatePresence mode="wait">
        {loading ? renderLoading() : renderContent()}
      </AnimatePresence>
    </ContainerTransition>
  );
}
