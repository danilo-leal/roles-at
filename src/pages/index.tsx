import { useEffect, useState, useRef } from "react";
import { Job } from "@/types/job";
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { Navbar } from "@/components/primitives/Navbar";
import { Chip } from "@/components/primitives/Chip";
import { ContainerTransition } from "@/components/primitives/Container";
import { Skeleton } from "@/components/primitives/Skeleton";
import { SectionDivider } from "@/components/primitives/Divider";
import { Input, InputGroup } from "@/components/primitives/Input";
import { Kbd } from "@/components/primitives/Keybinding";
import { formatDate } from "@/utils/date";
import { MapPin, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

  useEffect(() => {
    const filtered = jobs.filter((job) => {
      const searchMatch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase());

      return searchMatch;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm]);

  useEffect(() => {
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
      className="py-2 flex flex-col gap-3"
    >
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <Link
            key={job.id}
            href={job.company_slug}
            className={clsx(
              "group cursor-pointer rounded-lg p-4 flex items-center gap-4",
              "border border-zinc-200/60 dark:border-zinc-600/20",
              "hover:border-orange-300 dark:hover:border-orange-300/40",
              "hover:bg-zinc-50 dark:hover:bg-zinc-800/40",
              "hover:[box-shadow:5px_5px_0_hsla(26,_90%,_40%,_0.1)]",
              "transition-colors duration-100 fv-style",
            )}
          >
            {job.avatar_img && (
              <Image
                src={job.avatar_img}
                alt={`${job.company} logo`}
                width={44}
                height={44}
                className="rounded-full size-8 grow-0 shrink-0 object-cover border default-border-color"
              />
            )}
            <div className="w-full flex flex-col">
              <div className="w-full flex items-center justify-between">
                <h2 className="capitalize font-medium">{job.title}</h2>
                <p className="shrink-0 flex items-center gap-1.5 text-xs font-mono pb-1 dark:text-zinc-500">
                  <Clock size={12} />
                  {formatDate(job.created_at)}
                </p>
              </div>
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <p className="text-sm text-zinc-700 dark:text-zinc-500">
                  {job.company}
                </p>
                {job.location && (
                  <Chip color="zinc" className="gap-1">
                    <MapPin size={12} className="opacity-50" />
                    <span className="">{job.location}</span>
                  </Chip>
                )}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No matching jobs found</p>
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
        <p className="text-xs font-mono dark:text-zinc-500">
          {filteredJobs.length} Open Roles
        </p>
      </hgroup>
      <InputGroup data-slot="search" className="mb-3">
        <Search data-slot="icon" />
        <Input
          ref={searchInputRef}
          startSlot
          keybinding
          type="search"
          aria-label="Search"
          placeholder="Search for roles, location, or companies…"
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
